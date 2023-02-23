// 导入CryptoJS库
// const CryptoJS = require('crypto-js');
const jsSHA = require('jssha');
// 生成一个长度为n的随机字符串
function generateRandomString(n) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // 生成随机字符串的字符集
  let result = '';
  for (let i = 0; i < n; i++) {
    const index = Math.floor(Math.random() * chars.length); // 从字符集中随机选择一个字符的下标
    result += chars.charAt(index); // 将选择的字符加入结果字符串
  }
  return result;
}

// 生成防伪认证码
function generateAntiFakeCode() {
  const timestamp = new Date().getTime(); // 使用时间戳作为随机数种子
  const rand1 = generateRandomString(8); // 生成8位随机字符串作为随机数1
  const rand2 = generateRandomString(8); // 生成8位随机字符串作为随机数2

  // 将时间戳和两个随机数拼接成一个字符串
  const plaintext = timestamp.toString() + rand1 + rand2;

  // 使用SHA256算法计算哈希值
  const sha256 = new jsSHA('SHA-256', 'TEXT');
  sha256.update(plaintext);
  const hash = sha256.getHash('HEX');

  // 将哈希值分成四组，每组四个字符
  const groups = [
    hash.slice(0, 4),
    hash.slice(4, 8),
    hash.slice(8, 12),
    hash.slice(12, 16)
  ];

  // 将每组字符转换成大写字母和数字的混合形式
  const antiFakeCode = groups.map(group => {
    const chars = group.split('');
    let result = '';
    for (const char of chars) {
      const code = char.charCodeAt(0);
      if (code >= 48 && code <= 57) { // 数字
        result += char;
      } else if (code >= 97 && code <= 122) { // 小写字母
        result += String.fromCharCode(code - 32); // 转换成大写字母
      } else if (code >= 65 && code <= 90) { // 大写字母
        result += char;
      } else { // 其他字符
        result += '0'; // 统一转换成数字0
      }
    }
    return result;
  }).join('');
  // console.log(antiFakeCode.length);

  let result = '';
  for (let i = 0; i < antiFakeCode.length; i++) {
    if (i % 4 == 0 && i != 0) {
      result += '-' + antiFakeCode[i];
    }
    else {
      result += antiFakeCode[i];
    }
  }
  return result;
}



// console.log(generateAntiFakeCode());

export default generateAntiFakeCode;
