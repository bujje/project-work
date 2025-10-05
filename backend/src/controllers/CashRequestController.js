const CashRequestModel = require('../models/CashRequestModel');
const { ValidateAndEncryptAmount, DecryptAndParseAmount } = require('../utils/EncryptionUtil');

class CashRequestController {
  /**
   * Create a new cash request
   */
  static async CreateCashRequest(Request, Response) {
    try {
      const UserId = Request.User.UserId;
      const { AmountUsed, Department, DateOfNeeded, Description, ExpenseType } = Request.body;

      // Validate and encrypt the amount
      const AmountUsedEncrypted = ValidateAndEncryptAmount(AmountUsed);

      const NewCashRequest = await CashRequestModel.CreateCashRequest({
        UserId,
        AmountUsedEncrypted,
        Department,
        DateOfNeeded,
        Description,
        ExpenseType,
      });

      // Decrypt amount for response (support lowercase field names from DB driver)
      const AmountUsedEncryptedFromDb = NewCashRequest.AmountUsedEncrypted ?? NewCashRequest.amountusedencrypted;
      let DecryptedAmount;
      try {
        console.log('Encrypted amount from DB:', AmountUsedEncryptedFromDb);
        DecryptedAmount = DecryptAndParseAmount(AmountUsedEncryptedFromDb);
        console.log('Decrypted amount:', DecryptedAmount);
      } catch (err) {
        console.error('Decryption failed in cash request create:', err.message);
        DecryptedAmount = parseFloat(AmountUsed) || 0;
      }

      Response.status(201).json({
        Success: true,
        Message: 'Cash request created successfully',
        Data: {
          CashRequest: {
            ...NewCashRequest,
            AmountUsed: DecryptedAmount,
            AmountUsedEncrypted: undefined, // Remove encrypted field from response
          },
        },
      });
    } catch (Err) {
      console.error('Create cash request error:', Err);
      Response.status(500).json({
        Success: false,
        Message: 'Failed to create cash request',
        Error: Err.message,
      });
    }
  }

  /**
   * Get all cash requests for the current user
   */
  static async GetUserCashRequests(Request, Response) {
    try {
      const UserId = Request.User.UserId;

      const CashRequests = await CashRequestModel.GetCashRequestsByUserId(UserId);

      // Decrypt amounts
      const DecryptedCashRequests = CashRequests.map(Request => {
        try {
          return {
            ...Request,
            AmountUsed: DecryptAndParseAmount(Request.AmountUsedEncrypted ?? Request.amountusedencrypted),
            AmountUsedEncrypted: undefined,
          };
        } catch (err) {
          console.error(`Failed to decrypt cash request ${Request.CashRequestId ?? Request.cashrequestid}:`, err.message);
          return {
            ...Request,
            AmountUsed: 0, // Set to 0 if decryption fails
            AmountUsedEncrypted: undefined,
          };
        }
      });

      Response.status(200).json({
        Success: true,
        Data: {
          CashRequests: DecryptedCashRequests,
          Count: DecryptedCashRequests.length,
        },
      });
    } catch (Err) {
      console.error('Get user cash requests error:', Err);
      Response.status(500).json({
        Success: false,
        Message: 'Failed to retrieve cash requests',
        Error: Err.message,
      });
    }
  }

  /**
   * Get a single cash request by ID
   */
  static async GetCashRequestById(Request, Response) {
    try {
      const UserId = Request.User.UserId;
      const { Id } = Request.params;

      const CashRequest = await CashRequestModel.GetCashRequestById(Id, UserId);

      if (!CashRequest) {
        return Response.status(404).json({
          Success: false,
          Message: 'Cash request not found',
        });
      }

      // Decrypt amount
      let DecryptedAmount;
      try {
        DecryptedAmount = DecryptAndParseAmount(CashRequest.AmountUsedEncrypted ?? CashRequest.amountusedencrypted);
      } catch (err) {
        console.error(`Failed to decrypt cash request ${CashRequest.CashRequestId ?? CashRequest.cashrequestid}:`, err.message);
        DecryptedAmount = 0; // Set to 0 if decryption fails
      }

      Response.status(200).json({
        Success: true,
        Data: {
          CashRequest: {
            ...CashRequest,
            AmountUsed: DecryptedAmount,
            AmountUsedEncrypted: undefined,
          },
        },
      });
    } catch (Err) {
      console.error('Get cash request error:', Err);
      Response.status(500).json({
        Success: false,
        Message: 'Failed to retrieve cash request',
        Error: Err.message,
      });
    }
  }

  /**
   * Update a cash request
   */
  static async UpdateCashRequest(Request, Response) {
    try {
      const UserId = Request.User.UserId;
      const { Id } = Request.params;
      const { AmountUsed, Department, DateOfNeeded, Description, ExpenseType, Status } = Request.body;

      const UpdateData = {
        Department,
        DateOfNeeded,
        Description,
        ExpenseType,
        Status,
      };

      // Encrypt amount if provided
      if (AmountUsed !== undefined) {
        UpdateData.AmountUsedEncrypted = ValidateAndEncryptAmount(AmountUsed);
      }

      const UpdatedCashRequest = await CashRequestModel.UpdateCashRequest(Id, UserId, UpdateData);

      if (!UpdatedCashRequest) {
        return Response.status(404).json({
          Success: false,
          Message: 'Cash request not found or unauthorized',
        });
      }

      // Decrypt amount
      const DecryptedAmount = DecryptAndParseAmount(UpdatedCashRequest.AmountUsedEncrypted ?? UpdatedCashRequest.amountusedencrypted);

      Response.status(200).json({
        Success: true,
        Message: 'Cash request updated successfully',
        Data: {
          CashRequest: {
            ...UpdatedCashRequest,
            AmountUsed: DecryptedAmount,
            AmountUsedEncrypted: undefined,
          },
        },
      });
    } catch (Err) {
      console.error('Update cash request error:', Err);
      Response.status(500).json({
        Success: false,
        Message: 'Failed to update cash request',
        Error: Err.message,
      });
    }
  }

  /**
   * Delete a cash request
   */
  static async DeleteCashRequest(Request, Response) {
    try {
      const UserId = Request.User.UserId;
      const { Id } = Request.params;

      const DeletedCashRequest = await CashRequestModel.DeleteCashRequest(Id, UserId);

      if (!DeletedCashRequest) {
        return Response.status(404).json({
          Success: false,
          Message: 'Cash request not found or unauthorized',
        });
      }

      Response.status(200).json({
        Success: true,
        Message: 'Cash request deleted successfully',
      });
    } catch (Err) {
      console.error('Delete cash request error:', Err);
      Response.status(500).json({
        Success: false,
        Message: 'Failed to delete cash request',
        Error: Err.message,
      });
    }
  }

  /**
   * Get all cash requests (admin view)
   */
  static async GetAllCashRequests(Request, Response) {
    try {
      const CashRequests = await CashRequestModel.GetAllCashRequests();

      // Decrypt amounts
      const DecryptedCashRequests = CashRequests.map(Request => {
        try {
          return {
            ...Request,
            AmountUsed: DecryptAndParseAmount(Request.AmountUsedEncrypted ?? Request.amountusedencrypted),
            AmountUsedEncrypted: undefined,
          };
        } catch (err) {
          console.error(`Failed to decrypt cash request ${Request.CashRequestId ?? Request.cashrequestid}:`, err.message);
          return {
            ...Request,
            AmountUsed: 0, // Set to 0 if decryption fails
            AmountUsedEncrypted: undefined,
          };
        }
      });

      Response.status(200).json({
        Success: true,
        Data: {
          CashRequests: DecryptedCashRequests,
          Count: DecryptedCashRequests.length,
        },
      });
    } catch (Err) {
      console.error('Get all cash requests error:', Err);
      Response.status(500).json({
        Success: false,
        Message: 'Failed to retrieve cash requests',
        Error: Err.message,
      });
    }
  }
}

module.exports = CashRequestController;