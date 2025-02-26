/**
 * @param  {object} containerDOMElement
 * @param  {string} priceDOMElement
 * @param  {object} taxes
 * @param  {string} currency
 * @returns {number}
 */
function getPriceWithTaxes(containerDOMElement, priceDOMElement, taxes, currency = 'ARS') {
  const priceText = containerDOMElement.querySelector(priceDOMElement).textContent;
  const priceIsFree = priceText.includes('Free') || priceText.includes('FREE') || priceText.includes('Gratuito');
  const priceWithTaxes = (p) => (p + p * (taxes.ganancias + taxes.pais)).toFixed(2)

  if (priceIsFree) {
    return 0;
  }

  const price = sanitizePricePunctuation(sanitizePriceSigns(priceText));

  if (price === 0) {
    return 0;
  }

  if (currency === 'US') {
    const priceARS = price * sanitizePricePunctuation(dollar.data.venta);
    return priceWithTaxes(priceARS);
  }

  return priceWithTaxes(price);
}


/**
 * @param  {number} price
 * @param  {object} targetDOMElement
 */
function drawBadge(price, targetDOMElement) {
  const badge = document.createElement('p');
  badge.innerText = price === 0 ? ' Gratis' : `AR${priceFormatter(price)}`;
  badge.setAttribute('title', 'Este es el precio real que vas a pagar (incluye impuestos)');
  badge.classList.add('priceWithTaxesBadge');

  targetDOMElement.appendChild(badge);
}

/**
 * @param  {number} price
 * @param  {string} format
 * @param  {string} currency
 * @returns {string}
 */
function priceFormatter(price, format = 'es-AR', currency = 'ARS') {
  const formatter = new Intl.NumberFormat(format, {
    style: 'currency',
    currency: currency
  });

  return formatter.format(price);
}

/**
 * @param  {string} price
 * @returns {string}
 */
function sanitizePriceSigns(price) {
  /**
   * Tested on:
   *
   * ARS$ 1,222.43
   * US$ 1,222.43
   * $ 1,222.43
   *  ARS$ 1,222.43
   * ARS$1,222.43
   * ARS$ 1,222.43+
   * US$ 1,222.43+
   * $ 1,222.43+
   *  ARS$ 1,222.43 +
   * ARS$1,222.43 +
   * * ARS$ 1,222.43 +
   * US$ 1,222.43 +
   * $ 1,222.43 +
   *  ARS$ 1,222.43 +
   * ARS$1,222.43 +
   */
  return price.replace(/^\s*[a-zA-z]*\$\s?(.*)\s?\+?/gi, '$1');
}

/**
 * @param  {string} price
 * @returns {number}
 */
function sanitizePricePunctuation(price) {
  /**
   * Tested on:
   *
   * 1.234,55
   * 1,234.55
   * 1234,55
   * 1234.55
   * 111,22
   * 111.22
   * 11,22
   * 11.22
   * 1,22
   * 1.22
   * 1,2
   * 1.2
   */

  return +price.replace(/(\d?)[\.|\,]?(.+)[\,|\.](\d{1,2})/gi, '$1$2.$3');
}