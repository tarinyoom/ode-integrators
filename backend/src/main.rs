use lambda_runtime::{service_fn, LambdaEvent, Error};
use serde_json::{json, Value};
use std::collections::HashMap;

#[tokio::main]
async fn main() -> Result<(), Error> {
    let func = service_fn(func);
    lambda_runtime::run(func).await?;
    Ok(())
}

async fn func(event: LambdaEvent<Value>) -> Result<Value, Error> {
    let (event, _context) = event.into_parts();
    let max_iters: u64 = event["numSteps"].as_u64().unwrap_or(3);
    let d_h: f64 = event["timeStep"].as_f64().unwrap_or(0.1);
    
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