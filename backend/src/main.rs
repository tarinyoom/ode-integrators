use lambda_runtime::{service_fn, LambdaEvent, Error};
use serde_json::{json, Value};
use nalgebra::{Vector2};
const GRAVITY: f64 = 6.6743;

use serde::{Deserialize, Serialize};

type Vector = Vector2<f64>;
type Scalar = f64;

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

    if req.method == "RK4" {
        return integrate_rk4(req);
    } else if req.method == "Backward Euler" {
        return integrate_fe(req);
    } else {
        return integrate_fe(req);
    }
}

fn test_force(x: Vector) -> Vector {
    let d2 = x[0].powf(2.) + x[1].powf(2.);
    -x * GRAVITY / d2
}

fn step_rk4(x: Vector, f: fn(Vector) -> Vector, h: Scalar) -> Vector {
    let k1 = f(x);
    let k2 = f(x + k1 * h / 2.);
    let k3 = f(x + k2 * h / 2.);
    let k4 = f(x + k3 * h);
    
    x + (k1 + 2. * k2 + 2. * k3 + k4) * h / 6.
}

fn integrate_fe(req: IVPRequest) -> Vec<Point> {
    let mut trajectory: Vec<Point> = Vec::new();
    trajectory.push(Point{x: req.x0, v: req.v0});
    
    for _ in 1..req.n {
        let p = trajectory.last().expect("This should be impossible");
        trajectory.push(
            Point {
                x: p.x + req.h * p.v, 
                v: p.v + req.h * test_force(p.x)
            });
    }
    
    trajectory
}

fn integrate_rk4(req: IVPRequest) -> Vec<Point> {
    let mut trajectory: Vec<Point> = Vec::new();
    trajectory.push(Point{x: req.x0, v: req.v0});
    
    for _ in 1..req.n {
        let p = trajectory.last().expect("This should be impossible");
        trajectory.push(
            Point {
                x: step_rk4(p.x, test_force, req.h), 
                v: step_rk4(p.v, test_force, req.h)
            });
    }
    
    trajectory
}
