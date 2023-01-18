use lambda_runtime::{service_fn, LambdaEvent, Error};
use serde_json::{json, Value};
use nalgebra::{Vector2, Vector4};

use serde::{Deserialize, Serialize};

type Scalar = f64;
type State = Vector4<f64>;

#[derive(Deserialize, Serialize)]
struct Point {
    x: Vector2<f64>,
    v: Vector2<f64>
}

#[derive(Deserialize)]
struct IVPRequest {
    x0: Vector2<f64>,
    v0: Vector2<f64>,
    n: i32,
    h: Scalar,
    field: String,
    method: String
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let func = service_fn(func);
    lambda_runtime::run(func).await?;
    Ok(())
}

async fn func(event: LambdaEvent<Value>) -> Result<Value, Error> {
    let (msg, _context) = event.into_parts();
    let body = &msg["body"].as_str().unwrap();
    
    let trajectory = integrate(serde_json::from_str(body)?);
    
    Ok(json!({"trajectory": trajectory}))
}

fn integrate(req: IVPRequest) -> Vec<Point> {

    let step = {
        if req.method == "RK4" {
            step_rk4
        } else {
            step_fe
        }
    };
    
    let field = {
        if req.field == "single_repulsor" {
            f_origin_repulsor
        } else {
            f_origin_attractor
        }
    };
    
    let mut trajectory: Vec<State> = Vec::new();
    trajectory.push(State::new(req.x0[0], req.x0[1], req.v0[0], req.v0[1]));
    
    for _ in 0..req.n {
        let s = trajectory.last().expect("This should be impossible");
        trajectory.push(step(*s, field, req.h));
    }
    
    trajectory.into_iter().map(|s| Point {x: Vector2::new(s[0], s[1]), v: Vector2::new(s[2], s[3])}).collect()
}

fn f_origin_attractor(x: State) -> State {
    let d2 = x[0].powf(2.) + x[1].powf(2.);
    let force = -x * 6.6743 / d2;
    
    State::new(x[2], x[3], force[0], force[1])
}

fn f_origin_repulsor(x: State) -> State {
    let d2 = x[0].powf(2.) + x[1].powf(2.);
    let penalty = {
        if d2 > 9. {
            (9. - d2) * 200.
        } else {
            0.
        }
    };
    
    let force = x * (6.6743 / d2 + penalty);
    
    State::new(x[2], x[3], force[0], force[1])
}

fn step_fe(y: &State, f: fn(State) -> State, h: Scalar) -> State {
    y + h * f(y)
}

fn step_rk4(y: &State, f: fn(State) -> State, h: Scalar) -> State {
    let k1 = f(y);
    let k2 = f(y + h * k1 / 2.);
    let k3 = f(y + h * k2 / 2.);
    let k4 = f(y + h * k3);
    
    y + h * (k1 + 2. * k2 + 2. * k3 + k4) / 6.
}
