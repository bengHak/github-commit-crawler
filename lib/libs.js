const getKoreaDateString = (date) => {
  return date
    .toLocaleString('ko-KR')
    .split('.')
    .map((e) => e.trim())
    .slice(0, 3)
    .join('-');
};

module.exports = {
  getKoreaDateString,
};
