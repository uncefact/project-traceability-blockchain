require('dotenv').config();
import { cors } from "./functions/cors";
import { materialUpdate } from "./functions/material/materialUpdate";
import { materialStore } from "./functions/material/materialStore";
import { materialAllowRead } from "./functions/material/materialAllowRead";
import { materialRetrieve } from "./functions/material/materialRetrieve";
import { materialRetrieveAll } from "./functions/material/materialRetrieveAll";
import { tradeAllowRead } from "./functions/trade/tradeAllowRead";
import { tradeRetrieve } from "./functions/trade/tradeRetrieve";
import { tradeRetrieveAll } from "./functions/trade/tradeRetrieveAll";
import { tradeStore } from "./functions/trade/tradeStore";
import { tradeUpdate } from "./functions/trade/tradeUpdate";
import { transformationAllowRead } from "./functions/transformation/transformationAllowRead";
import { transformationRetrieve } from "./functions/transformation/transformationRetrieve";
import { transformationRetrieveAll } from "./functions/transformation/transformationRetrieveAll";
import { transformationStore } from "./functions/transformation/transformationStore";
import { transformationUpdate } from "./functions/transformation/transformationUpdate";

import { objectEventStandardStore } from "./functions/json_standard/objectEventStandard/objectEventStandardStore";
import { objectEventStandardRead } from "./functions/json_standard/objectEventStandard/objectEventStandardRead";
import { objectEventStandardUpdate } from "./functions/json_standard/objectEventStandard/objectEventStandardUpdate";
import { transformationEventStandardStore } from "./functions/json_standard/transformationEventStandard/transformationEventStandardStore";
import { transformationEventStandardUpdate } from "./functions/json_standard/transformationEventStandard/transformationEventStandardUpdate";
import { transformationEventStandardRead } from "./functions/json_standard/transformationEventStandard/transformationEventStandardRead";
import { transactionEventStandardStore } from "./functions/json_standard/transactionEventStandard/transactionEventStandardStore";
import { transactionEventStandardRead } from "./functions/json_standard/transactionEventStandard/transactionEventStandardRead";
import { transactionEventStandardUpdate } from "./functions/json_standard/transactionEventStandard/transactionEventStandardUpdate";

exports.cors = cors;

exports.materialUpdate = materialUpdate;
exports.materialStore = materialStore;
exports.materialAllowRead = materialAllowRead;
exports.materialRetrieve = materialRetrieve;
exports.materialRetrieveAll = materialRetrieveAll;

exports.tradeAllowRead = tradeAllowRead;
exports.tradeRetrieve = tradeRetrieve;
exports.tradeRetrieveAll = tradeRetrieveAll;
exports.tradeStore = tradeStore;
exports.tradeUpdate = tradeUpdate;

exports.transformationAllowRead = transformationAllowRead;
exports.transformationRetrieve = transformationRetrieve;
exports.transformationRetrieveAll = transformationRetrieveAll;
exports.transformationStore = transformationStore;
exports.transformationUpdate = transformationUpdate;

exports.transformationEventStandardStore = transformationEventStandardStore;
exports.transformationEventStandardUpdate = transformationEventStandardUpdate;
exports.transformationEventStandardRead = transformationEventStandardRead;

exports.objectEventStandardStore = objectEventStandardStore;
exports.objectEventStandardRead = objectEventStandardRead;
exports.objectEventStandardUpdate = objectEventStandardUpdate;

exports.transactionEventStandardStore = transactionEventStandardStore;
exports.transactionEventStandardRead = transactionEventStandardRead;
exports.transactionEventStandardUpdate = transactionEventStandardUpdate;
