import { User } from "../models/users.js";
import { Contract } from "../models/contract.js";
import * as mindee from "mindee";

const mindeeClient = new mindee.Client({ apiKey: "5e7445b7a9bec0e8db2203520f3c315b" })
.addEndpoint({
    accountName: "lavirus",
    endpointName: "identity_card",
});

export const scannId = async (req, res) => {
  // Load a file from disk and parse it
  const document = req.files.document.tempFilePath;
  try {
    const apiResponse = await mindeeClient
      .docFromPath(document)
      .parse(mindee.CustomV1, { endpointName: 'identity_card' });

    // Extract fields using regular expressions
    const responseString = apiResponse.document.toString();

    const domiciliuRegex = /domiciliu:\s*(.*)/;
    const nrBuletinRegex = /nr_buletin:\s*(.*)/;
    const numeRegex = /nume:\s*(.*)/;
    const prenumeRegex = /prenume:\s*(.*)/;
    const serieBuletinRegex = /serie_buletin:\s*(.*)/;

    const domiciliuMatch = responseString.match(domiciliuRegex);
    const nrBuletinMatch = responseString.match(nrBuletinRegex);
    const numeMatch = responseString.match(numeRegex);
    const prenumeMatch = responseString.match(prenumeRegex);
    const serieBuletinMatch = responseString.match(serieBuletinRegex);

    const domiciliu = domiciliuMatch ? domiciliuMatch[1].trim() : null;
    const nrBuletin = nrBuletinMatch ? nrBuletinMatch[1].trim() : null;
    const nume = numeMatch ? numeMatch[1].trim() : null;
    const prenume = prenumeMatch ? prenumeMatch[1].trim() : null;
    const serieBuletin = serieBuletinMatch ? serieBuletinMatch[1].trim() : null;

    console.log('domiciliu:', domiciliu);
    console.log('nr_buletin:', nrBuletin);
    console.log('nume:', nume);
    console.log('prenume:', prenume);
    console.log('serie_buletin:', serieBuletin);

    res.send({
      domiciliu,
      nrBuletin,
      nume,
      prenume,
      serieBuletin,
    });
  } catch (err) {
    console.log('ERROR:', err);
    res.status(500).send('An error occurred');
  }
};


export const createContract = async (req, res) => {
  try {
    const {
      dataInchiriere,
      adresaApartament,
      componenteApartament,
      stareApartament,
      dataFinal,
      sumaChirie,
      numeProprietar,
      prenumeProprietar,
      domiciliuProprietar,
      serieIdProprietar,
      nrIdProprietar,
      numeChirias,
      prenumeChirias,
      domiciliuChirias,
      serieIdChirias,
      nrIdChirias,
    } = req.body;
    
    // Find the logged-in user
    const user = await User.findById(req.user._id);

    // Create a new contract
    const contract = new Contract({
      landlord: user._id,
      dataInchiriere,
      adresaApartament,
      componenteApartament,
      stareApartament,
      dataFinal,
      sumaChirie,
      numeProprietar,
      prenumeProprietar,
      domiciliuProprietar,
      serieIdProprietar,
      nrIdProprietar,
      numeChirias,
      prenumeChirias,
      domiciliuChirias,
      serieIdChirias,
      nrIdChirias,
    });
    // Save the contract
    await contract.save();
    return res.status(201).json({ message: 'Contract created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create contract' });
  }
};


// Controller function to get the logged-in landlord's contract
export const getUserContract = async (req, res) => {
    try {
      // Retrieve the logged-in user's ID
      const userId = req.user._id;
      console.log(userId)
      const userRole = req.user.role;
      console.log(userRole)
      const userApartamentNr = req.user.apartamentNr
      let contract = null
      if(userRole == 'landlord'){
        // Find the contract associated with the user
        contract = await Contract.findOne({ landlord: userId });
        console.log(contract)
      }
      else if(userRole == 'renter'){
        // Find the user with the matching apartamentNr and role landlord
        const landlord = await User.findOne({apartamentNr: userApartamentNr, role: 'landlord'})
        console.log(landlord)
        if(!landlord){
          return res.status(404).json({ error: 'Landlord not found' });
        }
        const landlordId = landlord._id
        contract = await Contract.findOne({ landlord: landlordId});
        console.log(contract)
      }

      if (!contract) {
        return res.status(404).json({ error: 'Contract not found' });
      }

      return res.status(200).json(contract);
      console.log(contract);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to get contract' });
    }
  };


export const getSumaChirie = async (req, res) => {
  try {
    const currentUser = req.user;
    console.log(currentUser)
    const apartamentNr = req.user.apartamentNr;
    console.log(apartamentNr)
    // Find the landlord user with the same apartmentNr
    const landlord = await User.findOne({
      apartamentNr: currentUser.apartamentNr,
      role: 'landlord',
    });

    if (!landlord) {
      return res.status(404).json({ message: 'Landlord not found' });
    }
    console.log(landlord)
    // Find the contract for the landlord's ID
    const contract = await Contract.findOne({ landlord: landlord._id });

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    console.log(contract)
    const sumaChirie = contract.sumaChirie;
    console.log(sumaChirie)
    return res.status(200).json({ sumaChirie });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
}; 