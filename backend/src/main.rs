use lambda_runtime::{service_fn, LambdaEvent, Error};
use serde_json::{json, Value};
use nalgebra::{Vector2, Vector4, Matrix4};
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

const K: f64 = 1.;
const CHAMBER_RADIUS_SQ: f64 = 9.;
const PENALTY: f64 = 200.;

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
        if req.method == "Forward Euler" {
            step_fe
        } else if req.method == "Backward Euler" {
            step_be
        } else {
            step_rk4
        }
    };
    
    let field = {
        if req.field == "single_repulsor" {
            f_origin_repulsor
        } else {
            f_origin_attractor
        }
    };
    
    let j = {
        if req.field == "single_repulsor" {
            j_origin_repulsor
        } else {
            j_origin_attractor
        }
    };
    
    let mut trajectory: Vec<State> = Vec::new();
    trajectory.push(State::new(req.x0[0], req.x0[1], req.v0[0], req.v0[1]));
    
    for _ in 0..req.n {
        let s = trajectory.last().expect("This should be impossible");
        trajectory.push(step(*s, field, j, req.h));
    }
    
    trajectory.into_iter().map(|s| Point {x: Vector2::new(s[0], s[1]), v: Vector2::new(s[2], s[3])}).collect()
}

fn f_origin_attractor(x: State) -> State {
    let d2 = x[0].powf(2.) + x[1].powf(2.);
    let d3 = d2.powf(1.5);
    let force = -x * K / d3;
    
    State::new(x[2], x[3], force[0], force[1])
}

fn j_origin_attractor(x: State, h: f64) -> Matrix4<f64> {

    // ad hoc computation steps
    let denom = (x[0].powf(2.) + x[1].powf(2.)).powf(2.5);
    let diff1 = h * K * (2. * x[0].powf(2.) - x[1].powf(2.)) / denom;
    let diff2 = h * K * (2. * x[1].powf(2.) - x[0].powf(2.)) / denom;
    let prod = h * K * 3. * x[0] * x[1] / denom;
    
    let j = Matrix4::new(
          -1.,    0.,   h,  0., 
           0.,   -1.,  0. ,  h,
        diff1,  prod, -1.,  0.,
         prod, diff2,  0., -1.
        );
        
    j
}

fn f_origin_repulsor(x: State) -> State {
    let d2 = x[0].powf(2.) + x[1].powf(2.);
    let d3 = d2.powf(1.5);
    
    let penalty = {
        if d2 > CHAMBER_RADIUS_SQ {
            (CHAMBER_RADIUS_SQ - d2) * PENALTY
        } else {
            0.
        }
    };
    
    let force = x * (K / d3 + penalty);
    
    State::new(x[2], x[3], force[0], force[1])
}

// this needs to be revisited
fn j_origin_repulsor(x: State, h: f64) -> Matrix4<f64> {

    // ad hoc computation steps
    let r2 = x[0].powf(2.) + x[1].powf(2.);

    let k = {
        if r2 < CHAMBER_RADIUS_SQ {
            -K
        } else {
            PENALTY - K
        }
    };

    let denom = r2.powf(1.25);
    let diff1 = - h * k * (2. * x[0].powf(2.) - x[1].powf(2.)) / denom;
    let diff2 = - h * k * (2. * x[1].powf(2.) - x[0].powf(2.)) / denom;
    let prod = - h * k * 3. * x[0] * x[1] / denom;
    
    let j = Matrix4::new(
         -1.,    0.,  h,  0., 
          0.,   -1.,  0.,  h,
        diff1,  prod, -1.,  0.,
        prod, diff2,  0., -1.
        );
        
    j
}

fn step_fe(y: State, f: fn(State) -> State, _j: fn(State, f64) -> Matrix4<f64>, h: Scalar) -> State {
    y + h * f(y)
}

fn step_be(y: State, f: fn(State) -> State, j: fn(State, f64) -> Matrix4<f64>, h: Scalar) -> State {
    let mut approx = step_fe(y, f, j, h);

    for _ in 0..100 {
    
        let diff = j(approx, h).lu().solve(&(y + h * f(approx) - approx));
        match diff {
            Some(value) => { approx -= value;}
            None        => { return y; }
        }
    }
    
    approx
}

fn step_rk4(y: State, f: fn(State) -> State, _j: fn(State, f64) -> Matrix4<f64>, h: Scalar) -> State {
    let k1 = f(y);
    let k2 = f(y + h * k1 / 2.);
    let k3 = f(y + h * k2 / 2.);
    let k4 = f(y + h * k3);
    
    y + h * (k1 + 2. * k2 + 2. * k3 + k4) / 6.
}
