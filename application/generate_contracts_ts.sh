docker build -t contract_compiler ./blockchain
mkdir -p blockchain/build/contracts-ts/
docker cp $(docker create --rm contract_compiler):/app/build/contracts-ts blockchain/build/
rm -rf frontend/src/contracts || true
mv blockchain/build/contracts-ts frontend/src/contracts
