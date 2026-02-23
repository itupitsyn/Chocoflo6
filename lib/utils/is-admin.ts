export const isAdmin = (initData: string | null | undefined): boolean => {
  const adminId = process.env['ADMIN_ID'];
  if (!initData || !adminId) {
    return false;
  }

  const decodedData = decodeURIComponent(initData);
  const urlParams = new URLSearchParams(decodedData);
  const usr = urlParams.get('user');

  if (!usr) {
    return false;
  }

  try {
    const parsed = JSON.parse(usr);

    return !!parsed.id && String(parsed.id) === adminId;
  } catch (e) {
    console.error(e);

    return false;
  }
};
