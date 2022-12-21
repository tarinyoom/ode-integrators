use lambda_runtime::{service_fn, LambdaEvent, Error};
use serde_json::{json, Value};

#[tokio::main]
async fn main() -> Result<(), Error> {
    let func = service_fn(func);
    lambda_runtime::run(func).await?;
    Ok(())
}

async fn func(event: LambdaEvent<Value>) -> Result<Value, Error> {
    let (event, _context) = event.into_parts();
    let first_name = event["firstName"].as_str().unwrap_or("world");

    Ok(json!({
    "data": [
    	{"x": 0, "y": 0.5},
    	{"x": -1, "y": 1.3},
		{"x": -2, "y": 1.2},
		{"x": -2.2, "y": 0.5},
		{"x": 0, "y":-2},
		{"x": 2.2, "y": 0.5},
		{"x": 2, "y": 1.3},
		{"x": 1, "y": 1.2},
		{"x":0, "y": 0.5}
    ]}))
}