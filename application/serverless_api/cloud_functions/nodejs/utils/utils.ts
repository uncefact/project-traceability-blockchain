export const getUsernameByRequest = (req: any, res: any): string | undefined => {
  if (process.env.ENV_IS_LOCAL)
    return "subject";

  let token = req.get("X-Apigateway-Api-Userinfo");

  // decode from base64 to string
  if (token) {
    token = Buffer.from(token, 'base64').toString('ascii');

    const subject = JSON.parse(token).sub;
    if (subject) {
      return subject;
    }
    else {
      res.status(401).send("Authorization token is not correct!");
    }
  }
  else {
    res.status(401).send("Authorization token is not present!");
  }
  return undefined;
}

export const validateRequest = (obj: { [key: string]: any }, requiredFields: string[]) => {
  // TODO: fare in modo che il validate ritorni anche il nome del campo che manca (for con .includes)
  for (const requiredField of requiredFields) {
    if (!(requiredField in obj)) {
      throw new Error(`Error: request fields missing -> ${requiredField}`);
    }
  }
}