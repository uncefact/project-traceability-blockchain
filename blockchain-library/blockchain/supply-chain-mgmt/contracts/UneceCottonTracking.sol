//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";

// --------------------------------------------------------------------------
// STRUCTS
// --------------------------------------------------------------------------

struct Index {
    // reader's public key = K
    string encrypted_symmetric_key; // encrypted with K
    string encrypted_id; // id of the resource (material, trade, transformation, certificate), encrypted with K
}

struct Material {
    string id;
    address owner;
    string encrypted_data; // with the shared symmetric key
}

struct Trade {
    string id;
    address owner;
    string[2][] materials_ids; // list of [materialInId, materialOutId]
    string encrypted_data; // with the shared symmetric key
}

struct Transformation {
    string id;
    address owner;
    string[] materials_in_ids;
    string material_out_id;
    string encrypted_data; // with the shared symmetric key
}

struct Certificate {
    string id;
    address owner;
    string encrypted_data; // with the shared symmetric key
}

contract UneceCottonTracking {
    // --------------------------------------------------------------------------
    // EVENTS
    // --------------------------------------------------------------------------
    event ResourceStored(
        string _resource_type,
        address indexed _from,
        string _resource_id
    );
    event ResourceIndexStored(
        string _resource_type,
        address indexed _from,
        address _reader
    );
    event ResourceUpdated(
        string _resource_type,
        address indexed _from,
        string _resource_id
    );

    // --------------------------------------------------------------------------
    // Mapping between the id and the data
    // --------------------------------------------------------------------------

    // data id => data
    mapping(string => Material) private materials_map;

    mapping(string => Trade) private trades_map;

    mapping(string => Transformation) private transformations_map;

    mapping(string => Certificate) private certificates_map;

    // --------------------------------------------------------------------------
    // Mapping between the user's (company's) address and where to find the data
    // --------------------------------------------------------------------------

    // reader (company) public address => materials index array
    mapping(address => Index[]) private materials_indexing;

    // reader (company) public address => trades index array
    mapping(address => Index[]) private trades_indexing;

    // reader (company) public address => transformations index array
    mapping(address => Index[]) private transformations_indexing;

    // reader (company) public address => certificates index array
    mapping(address => Index[]) private certificates_indexing;

    function initialize() public view {
        console.log("Deploying new UneceCottonTracking");
    }

    // --------------------------------------------------------------------------

    function storeMaterial(
        string memory _material_id,
        address _owner,
        string memory _encrypted_data
    ) public {
        require(
            !compareStrings(materials_map[_material_id].id, _material_id),
            "A material with this id already exists."
        );

        materials_map[_material_id] = Material({
            id: _material_id,
            owner: _owner,
            encrypted_data: _encrypted_data
        });

        emit ResourceStored("material", msg.sender, _material_id);
    }

    function updateMaterial(
        string memory _material_id,
        string memory _encrypted_data
    ) public {
        require(
            compareStrings(materials_map[_material_id].id, _material_id),
            "No material found with this id."
        );

        require(
            materials_map[_material_id].owner == msg.sender,
            "Only the material owner can call this function."
        );

        materials_map[_material_id].encrypted_data = _encrypted_data;

        emit ResourceUpdated("material", msg.sender, _material_id);
    }

    // It means to add a reader
    function storeMaterialIndex(
        address _reader,
        string memory _encrypted_symmetric_key,
        string memory _encrypted_id
    ) public {
        materials_indexing[_reader].push(
            Index({
                encrypted_symmetric_key: _encrypted_symmetric_key,
                encrypted_id: _encrypted_id
            })
        );

        emit ResourceIndexStored("material", msg.sender, _reader);
    }

    function getMaterial(string memory _material_id)
        public
        view
        returns (Material memory)
    {
        return materials_map[_material_id];
    }

    function getMaterialsIndexes() public view returns (Index[] memory) {
        return materials_indexing[msg.sender];
    }

    // --------------------------------------------------------------------------

    function storeTransformation(
        string memory _transformation_id,
        address _owner,
        string[] memory _transformation_materials_in_ids,
        string memory _transformation_material_out_id,
        string memory _encrypted_data
    ) public {
        require(
            !compareStrings(
                transformations_map[_transformation_id].id,
                _transformation_id
            ),
            "A transformation with this id already exists."
        );

        transformations_map[_transformation_id] = Transformation({
            id: _transformation_id,
            owner: _owner,
            materials_in_ids: _transformation_materials_in_ids,
            material_out_id: _transformation_material_out_id,
            encrypted_data: _encrypted_data
        });

        emit ResourceStored("transformation", msg.sender, _transformation_id);
    }

    function updateTransformation(
        string memory _transformation_id,
        string[] memory _transformation_materials_in_ids,
        string memory _transformation_material_out_id,
        string memory _encrypted_data
    ) public {
        require(
            compareStrings(
                transformations_map[_transformation_id].id,
                _transformation_id
            ),
            "No transformation found with this id."
        );

        require(
            transformations_map[_transformation_id].owner == msg.sender,
            "Only the transformation owner can call this function."
        );

        transformations_map[_transformation_id] = Transformation({
            id: _transformation_id,
            owner: transformations_map[_transformation_id].owner,
            materials_in_ids: _transformation_materials_in_ids,
            material_out_id: _transformation_material_out_id,
            encrypted_data: _encrypted_data
        });

        emit ResourceUpdated("transformation", msg.sender, _transformation_id);
    }

    function storeTransformationIndex(
        address _reader,
        string memory _encrypted_symmetric_key,
        string memory _encrypted_id
    ) public {
        transformations_indexing[_reader].push(
            Index({
                encrypted_symmetric_key: _encrypted_symmetric_key,
                encrypted_id: _encrypted_id
            })
        );

        emit ResourceIndexStored("transformation", msg.sender, _reader);
    }

    function getTransformation(string memory _transformation_id)
        public
        view
        returns (Transformation memory)
    {
        return transformations_map[_transformation_id];
    }

    function getTransformationsIndexes() public view returns (Index[] memory) {
        return transformations_indexing[msg.sender];
    }

    // --------------------------------------------------------------------------

    function storeTrade(
        string memory _trade_id,
        address _owner,
        string[2][] memory _materials_ids,
        string memory _encrypted_data
    ) public {
        require(
            !compareStrings(trades_map[_trade_id].id, _trade_id),
            "A trade with this id already exists."
        );

        trades_map[_trade_id] = Trade({
            id: _trade_id,
            owner: _owner,
            materials_ids: _materials_ids,
            encrypted_data: _encrypted_data
        });

        emit ResourceStored("trade", msg.sender, _trade_id);
    }

    function updateTrade(
        string memory _trade_id,
        string[2][] memory _materials_ids,
        string memory _encrypted_data
    ) public {
        require(
            compareStrings(trades_map[_trade_id].id, _trade_id),
            "No trade found with this id."
        );

        require(
            trades_map[_trade_id].owner == msg.sender,
            "Only the trade owner can call this function."
        );

        trades_map[_trade_id] = Trade({
            id: _trade_id,
            owner: trades_map[_trade_id].owner,
            materials_ids: _materials_ids,
            encrypted_data: _encrypted_data
        });

        emit ResourceUpdated("trade", msg.sender, _trade_id);
    }

    function storeTradeIndex(
        address _reader,
        string memory _encrypted_symmetric_key,
        string memory _encrypted_id
    ) public {
        trades_indexing[_reader].push(
            Index({
                encrypted_symmetric_key: _encrypted_symmetric_key,
                encrypted_id: _encrypted_id
            })
        );

        emit ResourceIndexStored("trade", msg.sender, _reader);
    }

    function getTrade(string memory _trade_id)
        public
        view
        returns (Trade memory)
    {
        return trades_map[_trade_id];
    }

    function getTradesIndexes() public view returns (Index[] memory) {
        return trades_indexing[msg.sender];
    }

    // --------------------------------------------------------------------------

    function storeCertificate(
        string memory _certificate_id,
        address _owner,
        string memory _encrypted_data
    ) public {
        require(
            !compareStrings(
                certificates_map[_certificate_id].id,
                _certificate_id
            ),
            "A certificate with this id already exists."
        );

        certificates_map[_certificate_id] = Certificate({
            id: _certificate_id,
            owner: _owner,
            encrypted_data: _encrypted_data
        });

        emit ResourceStored("certificate", msg.sender, _certificate_id);
    }

    function updateCertificate(
        string memory _certificate_id,
        string memory _encrypted_data
    ) public {
        require(
            compareStrings(
                certificates_map[_certificate_id].id,
                _certificate_id
            ),
            "No certificate found with this id."
        );

        require(
            certificates_map[_certificate_id].owner == msg.sender,
            "Only the certificate owner can call this function."
        );

        certificates_map[_certificate_id].encrypted_data = _encrypted_data;

        emit ResourceUpdated("certificate", msg.sender, _certificate_id);
    }

    // It means to add a reader
    function storeCertificateIndex(
        address _reader,
        string memory _encrypted_symmetric_key,
        string memory _encrypted_id
    ) public {
        certificates_indexing[_reader].push(
            Index({
                encrypted_symmetric_key: _encrypted_symmetric_key,
                encrypted_id: _encrypted_id
            })
        );

        emit ResourceIndexStored("certificate", msg.sender, _reader);
    }

    function getCertificate(string memory _certificate_id)
        public
        view
        returns (Certificate memory)
    {
        return certificates_map[_certificate_id];
    }

    function getCertificatesIndexes() public view returns (Index[] memory) {
        return certificates_indexing[msg.sender];
    }

    function compareStrings(string memory a, string memory b)
        private
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
}
