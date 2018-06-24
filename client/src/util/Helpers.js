export function formatDate(dateString) {
  const date = new Date(dateString);

  const monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return date.getDate() + ' ' + monthNames[monthIndex] + ' ' + year;
}

export function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec"
  ];

  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return date.getDate() + ' ' + monthNames[monthIndex] + ' ' + year + ' - ' + date.getHours() + ':' + date.getMinutes();
}

export function validateThumbnailUrl(src) {
  if (!src) {
    return 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
  }
  return src;
}

export function printIsbn(isbn) {
  // ISBN10 또는 ISBN13 중에 하나 이상 존재하면 ''을 구분자로 출력됨
  // 2개 이상일 경우 하나만 출력
  if (isbn.split(' ').length > 1) {
    return isbn.split(' ')[0];
  }
  return isbn;
}
