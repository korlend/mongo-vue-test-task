
import axios from "axios";

import { DONATION_URLS } from "@/utils/config";

export default class DonationService {
  static makeDonation(amount: number, currency: string): Promise<any> {
    return axios.post(DONATION_URLS.MAKE_DONATION, {
      amount,
      currency,
    });
  }
}
