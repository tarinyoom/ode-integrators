use lambda_runtime::{service_fn, LambdaEvent, Error};
use serde_json::{json, Value};
use nalgebra::{Vector2};

use serde::{Deserialize, Serialize};

type Vector = Vector2<f64>;
type Scalar = f64;
type Force  = Vector;
type Position = Vector;

#[derive(Deserialize, Serialize)]
struct Point {
    x: Vector,
    v: Vector
}

#[derive(Deserialize)]
struct IVPRequest {
    x0: Vector,
    v0: Vector,
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
            force_origin_repulsor
        } else {
            force_origin_attractor
        }
    };
    
    let mut trajectory: Vec<Point> = Vec::new();
    trajectory.push(Point{x: req.x0, v: req.v0});
    
    for _ in 0..req.n {
        let p = trajectory.last().expect("This should be impossible");
        trajectory.push(step(&p, field, req.h));
    }
    
    trajectory
}

fn force_origin_attractor(x: Vector) -> Vector {
    let d2 = x[0].powf(2.) + x[1].powf(2.);
    -x * 6.6743 / d2
}

fn force_origin_repulsor(x: Vector) -> Vector {
    let d2 = x[0].powf(2.) + x[1].powf(2.);
    let penalty = {
        if d2 > 9. {
            (9. - d2) * 200.
        } else {
            0.
        }
    };
    
    x * (6.6743 / d2 + penalty)
}

fn step_fe(y: &Point, f: fn(Position) -> Force, h: Scalar) -> Point {
    Point {
        x: y.x + h * y.v,
        v: y.v + h * f(y.x)
    }
}

fn step_rk4(y: &Point, f: fn(Position) -> Force, h: Scalar) -> Point {
    // k1 through k4 for dx, l1 through l4 for dv
    let k1 = y.v;
    let l1 = f(y.x);
    
    let k2 = y.v + h * l1 / 2.;
    let l2 = f(y.x + h * k1 / 2.);
    
    let k3 = y.v + h * l2 / 2.;
    let l3 = f(y.x + h * k2 / 2.);
    
    let k4 = y.v + h * l3;
    let l4 = f(y.x + h * k3);
    
    Point {
        x: y.x + h * (k1 + 2. * k2 + 2. * k3 + k4) / 6.,
        v: y.v + h * (l1 + 2. * l2 + 2. * l3 + l4) / 6.
    }
}
