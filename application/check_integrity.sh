./generate_contracts_ts.sh
./generate_client_ts.sh
(
  cd frontend || exit
  npm i
  npm run build
  npm run test -- --watchAll=false
)