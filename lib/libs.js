const getKoreaDateString = (date) => {
  return date
    .toLocaleString('ko-KR')
    .split('.')
    .map((e) => {
      if (e.trim().length === 1) return '0' + e.trim();
      return e.trim();
    })
    .slice(0, 3)
    .join('-');
};

module.exports = {
  getKoreaDateString,
};
