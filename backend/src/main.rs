use lambda_runtime::{service_fn, LambdaEvent, Error};
use serde_json::{json, Value};
const GRAVITY: f64 = 6.6743;

use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
struct Point {
    x: [f64; 2],
    v: [f64; 2]
}

#[derive(Deserialize)]
struct IVPRequest {
    x0: [f64; 2],
    v0: [f64; 2],
    n: i32,
    h: f64,
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
    let mut trajectory: Vec<Point> = Vec::new();
    trajectory.push(Point{x: req.x0, v: req.v0});
    
    for _ in 1..req.n {
        let p = trajectory.last().expect("This should be impossible");
        let d2 = p.x[0].powf(2.) + p.x[1].powf(2.);
        trajectory.push(
            Point {
                x: [p.x[0] + p.v[0] * req.h, p.x[1] + p.v[1] * req.h], 
                v: [p.v[0] - p.x[0] * GRAVITY * req.h / d2, p.v[1] - p.x[1] * GRAVITY * req.h / d2]
            });
    }
    
    trajectory
}
