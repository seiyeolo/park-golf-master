/**
 * localStorage 안전 read/write 래퍼
 */

export const safeGetJSON = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`localStorage 파싱 오류 [${key}]:`, e);
    return defaultValue;
  }
};

export const safeSetJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`localStorage 저장 오류 [${key}]:`, e);
    return false;
  }
};
