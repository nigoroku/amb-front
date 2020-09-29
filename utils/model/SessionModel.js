import moment from "moment";

// LoginBeforeSessionModel
export class LoginBeforeSessionModel {
  userId = "";
  loginRemember = false;
}

// LoginAfterSessionModel
export class LoginAfterSessionModel {
  user_id = "";
  owner_id = "";
  owner_name = "";
  email = "";
  role_id = "";
  role_name = "";
  is_alesca_role = "";
  session_key = "";
  expire_unix = moment().unix();
}
