const fs = require('fs');

const PetWalletFactory = artifacts.require('PetWalletFactory');
// const PetWallet = artifacts.require('PetWallet');

module.exports = function(deployer) {
  // deployer.deploy(PetWallet(_ownerAddress, _petId)).then((detail) => {
  //   address = '{' + '\n' + '"address":' + '"' + detail.constructor.address + '"' + '\n' + '}';
  //   fs.writeFile(
  //     './client/src/contractsAddress/PetWallet_Address.json',
  //     address,
  //     'utf8',
  //     (err) => {}
  //   );
  // });

  deployer.deploy(PetWalletFactory).then((detail) => {
    address = '{' + '\n' + '"address":' + '"' + detail.constructor.address + '"' + '\n' + '}';
    fs.writeFile(
      './client/src/contractsAddress/PetWalletFactory_Address.json',
      address,
      'utf8',
      (err) => {}
    );
  });
};
