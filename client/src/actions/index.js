import getWeb3 from '../utils/getWeb3';
import Factory from 'contracts/PetWalletFactory.json';
import petWallet from 'contracts/PetWallet.json';

export const WEB3_CONNECT = 'WEB3_CONNECT';
export const web3Connect = () => async (dispatch) => {
  // const web3 = new Web3(Web3.givenProvider || 'ws://127.0.0.1:8545');
  const web3 = await getWeb3();
  const accounts = await web3.eth.getAccounts();
  if (accounts.length > 0) {
    const account = accounts[0];
    const balance = await web3.eth.getBalance(account);
    dispatch({
      type: WEB3_CONNECT,
      web3,
      account,
      balance
    });
  } else {
    console.log('Account not found');
  }
};

export const INSTANTIATE_CONTRACT = 'INSTANTIATE_CONTRACT';
export const instantiateContracts = () => async (dispatch, getState) => {
  const state = getState();
  let web3 = state.tomo.web3;
  const networkId = process.env.REACT_APP_TOMO_ID;
  let factoryAddress = Factory.networks[networkId].address;
  let factory = new web3.eth.Contract(Factory.abi, factoryAddress);
  dispatch({
    type: INSTANTIATE_CONTRACT,
    factory
  });
};

export const GET_ALL_PETS = 'GET_ALL_PETS';
export const getAllPets = () => async (dispatch, getState) => {
  const state = getState();
  let web3 = state.tomo.web3;
  const factory = state.tomo.factory;
  const account = state.tomo.account;
  let petArray = await factory.methods.getAllPetAddressOf(account).call({ from: account });

  const pets = [];
  for (let i = 0; i < petArray.length; i++) {
    let pet = {
      instance: null,
      id: 0,
      amount: 0,
      time: 0
    };
    pet.instance = new web3.eth.Contract(petWallet.abi, petArray[i]);
    pet.id = await pet.instance.methods.petId().call();
    pet.amount = await pet.instance.methods.providentFund().call();
    pet.time = await pet.instance.methods.growthTime().call();
    pets.push(pet);
  }
  dispatch({
    type: GET_ALL_PETS,
    pets
  });
};

export const CREATE_NEW_PET = 'CREATE_NEW_PET';
export const createNewPet = (petId) => async (dispatch, getState) => {
  const state = getState();
  const factory = state.tomo.factory;
  const account = state.tomo.account;
  let newPet = await factory.methods
    .create(petId)
    .send({ from: account })
    .then(() => {
      dispatch({
        type: CREATE_NEW_PET,
        newPet
      });
    })
    .catch((e) => {
      console.log('Create pet action error', e);
    });
};
