# customer-decision-collector

NodeJs / Express web application for collecting customer decisions

## PREREQUISITES

- Install Node and NPM
- Install node packages: "npm install"

## EXECUTING

- npm start

or

- npm run dev (run locally)

## ENVIRONMENTS

- The environment get set by the variable: "NODE_ENV".
- Different configuration settings can be set in config/[ENVIRONMENT].json
- If nothing set "development" will be the default.
- Possible environments are: dev, production
- If running nodemon, create a nodemon.json file and set the environment variable

```
{
  "env": {
    "NODE_ENV": "dev"
  }
}
```

## TOUBLESHOOTING

### Kill open connections

```
lsof -i:3000
kill -9 [PID]
```
