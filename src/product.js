import fixText from "./fixtext";

const getProductDetails = async (query) => {
    const productPage = await fetchProductPage(query);
    if (!productPage) {
        return null; // Failed to fetch product page
    }

    const productDetail = {
        name: extractProductName(productPage),
        image: extractProductImage(productPage),
        price: extractProductPrice(productPage),
        original_price: extractOriginalPrice(productPage),
        in_stock: checkProductAvailability(productPage),
        rating_details: extractRatingDetails(productPage),
        features: extractProductFeatures(productPage),
        product_link: `https://www.amazon.in/${query}`,
    };

    return productDetail;
};

const fetchProductPage = async (query) => {
    try {
        const response = await fetch(`https://www.amazon.in/${query}`);
        if (!response.ok) {
            throw new Error('Failed to fetch product page');
        }
        return await response.text();
    } catch (error) {
        console.error(error);
        return null;
    }
};

const extractProductName = (productPage) => {
    try {
        const productName = productPage
            .split('<span id="productTitle" class="a-size-large product-title-word-break">')[1]
            .split("</span>")[0];
        return fixText(productName);
    } catch (error) {
        console.error('Error extracting product name:', error.message);
        return null;
    }
};

const extractProductImage = (productPage) => {
    try {
        const image = productPage
            .split('<div id="imgTagWrapperId" class="imgTagWrapper">')[1]
            .split('data-old-hires="')[1]
            .split('"')[0]
            .replaceAll("\n", "");
        return image === "" ? null : image;
    } catch (error) {
        console.error('Error extracting product image:', error.message);
        return null;
    }
};

const extractProductPrice = (productPage) => {
    try {
        const priceContainer = productPage
            .split('<div id="corePrice_feature_div" class="celwidget"')[1]
            .split('</div>')[0];
        const price = priceContainer
            .split('<span class="a-price-symbol">')[1]
            .split('</span>')[0]
            .trim();
        return parseFloat(price.replace("₹", "").replace(/,/g, "").trim());
    } catch (error) {
        console.error('Error extracting product price:', error.message);
        return null;
    }
};

const extractOriginalPrice = (productPage) => {
    try {
        const originalPrice = productPage
            .split('<span class="a-offscreen">')[1]
            .split("</span>")[0];
        return parseFloat(originalPrice.replace("₹", "").replace(/,/g, "").trim());
    } catch (error) {
        console.error('Error extracting original price:', error.message);
        return null;
    }
};

const checkProductAvailability = (productPage) => {
    try {
        return productPage.toLowerCase().includes("in stock");
    } catch (error) {
        console.error('Error checking product availability:', error.message);
        return false;
    }
};

const extractRatingDetails = (productPage) => {
    try {
        const ratingsCount = parseInt(
            productPage.split('total ratings</span>')[0]
                      .split('">')[1]
                      .replace(/,/g, "").trim()
        );
        const rating = parseFloat(
            productPage.split('aria-label="')[1]
                      .split(' out')[0]
                      .trim()
        );
        return { ratings_count: ratingsCount, rating: rating };
    } catch (error) {
        console.error('Error extracting rating details:', error.message);
        return null;
    }
};

const extractProductFeatures = (productPage) => {
    try {
        const featuresSection = productPage
            .split('<div id="feature-bullets" class="a-section a-spacing-medium a-spacing-top-small">')[1]
            .split('</ul>')[0];
        const features = featuresSection
            .split('<span class="a-list-item">')
            .slice(1)
            .map(feature => fixText(feature.split("</span>")[0].trim()));
        return features.length > 0 ? features : [null];
    } catch (error) {
        console.error('Error extracting product features:', error.message);
        return [null];
    }
};

export default getProductDetails;
