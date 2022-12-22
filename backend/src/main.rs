use lambda_runtime::{service_fn, LambdaEvent, Error};
use serde_json::{json, Value};
use std::collections::HashMap;

use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
struct IVPRequest {
    numSteps: i32,
    timeStep: f64,
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

    let req: IVPRequest = serde_json::from_str(body)?;
    
    let max_iters: i32 = req.numSteps;
    let d_h: f64 = req.timeStep;

    // make a vec of points
    let mut points: Vec<(f64, f64)> = Vec::new();
    let initial_condition: (f64, f64) = (1.0, 0.0);
    
    points.push(initial_condition);
    
    for _ in 1..max_iters {
        let p_1 = points.last().expect("points should be nonempty");
        let p_0 = (p_1.0 + p_1.1 * d_h, p_1.1 - p_1.0 * d_h);
        points.push(p_0);
    }

    let data: Vec<HashMap<&str, f64>> = 
        points.iter().map(|&p| HashMap::from([("x", p.0), ("y", p.1)]))
        .collect::<Vec<HashMap<&str, f64>>>();

    Ok(json!({
    "data": data}))
    
}