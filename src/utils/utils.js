

// Функция для получения даты рождения на основе TABEL_ID
export function getBirthDateFromTabelId(tabelId) {
  const trimmedId = tabelId.trim();
  const year = trimmedId.substring(0, 2); // Первые 2 символа - это год
  const month = trimmedId.substring(2, 4); // Следующие 2 символа - это месяц
  const day = trimmedId.substring(4, 6); // Следующие 2 символа - это день

  const currentYear = new Date().getFullYear();
  const currentCentury = Math.floor(currentYear / 100) * 100;
  const yearNumber = parseInt(year, 10); // Преобразуем строку в число

  // Определение полного года
  let fullYear;
  if (yearNumber >= 50) {
    fullYear = currentCentury - 100 + yearNumber; // Если больше 50, относим к прошлому веку
  } else {
    fullYear = currentCentury + yearNumber; // Если меньше 50, относим к текущему веку
  }

  return new Date(`${fullYear}-${month}-${day}`);
}
export const getUpcomingBirthdays = (users) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const birthdays = users.map(user => {
    const birthDate = getBirthDateFromTabelId(user.TABEL_ID);
    const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    thisYearBirthday.setHours(0, 0, 0, 0);

    const nextBirthday = thisYearBirthday >= today 
      ? thisYearBirthday 
      : new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());

    const daysUntilBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

    return {
      ...user,
      birthDate,
      nextBirthday,
      daysUntilBirthday,
    };
  });

  // Убираем фильтрацию по дате
  const birthdaysToday = birthdays.filter(user => user.daysUntilBirthday === 0);
  const otherBirthdays = birthdays.filter(user => user.daysUntilBirthday > 0);
  
  // Сортируем остальные дни рождения по дате
  otherBirthdays.sort((a, b) => a.nextBirthday - b.nextBirthday);

  // Возвращаем всех пользователей, включая тех, у кого день рождения сегодня
  return [...birthdaysToday, ...otherBirthdays];
};
