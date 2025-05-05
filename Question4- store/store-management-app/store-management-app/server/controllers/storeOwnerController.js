import {
    registerStoreOwner as registerService,
    loginStoreOwner as loginService
  } from '../services/storeOwnerService.js';
  
  // Register a new store owner
  export const registerStoreOwner = async (req, res) => {
    try {
      const { name, phoneNumber, code } = req.body;
      const result = await registerService(name, phoneNumber, code);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error registering store owner', error });
    }
  };
  
  // Login store owner
  export const loginStoreOwner = async (req, res) => {
    try {
      const { name, code } = req.body;
      const storeOwner = await loginService(name, code);
  
      if (!storeOwner) {
        return res.status(401).json({ message: 'Invalid name or code' });
      }
  
      res.status(200).json(storeOwner);
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error });
    }
  };