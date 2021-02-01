export const env = () => {
  console.log(process.env);
  const {
    REACT_APP_CHE_DOMAIN: CHE_DOMAIN = '192.168.99.100.nip.io',
  } = process.env;
  return {
    CHE_DOMAIN,
  };
};
