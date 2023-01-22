const Products = require("../models/product")


const getAllProducts = async (req, res) => {
    //query params based on the query params req.query but what if we dont have a valid query returns an empty array 
    //you could also destructure the items you need

    const { featured, company, name, sort, fields, numericFilters } = req.query
    const queryObject = {}

    if (featured) {
        queryObject.featured = featured === 'true' ? true : false
    }
    if (company) {
        queryObject.company = company
    }
    if (name) {
        // search for name where case is insensitive
        queryObject.name = {$regex: name, $options: "i"}
    }

    if (numericFilters) {
        const operatorMap = { '>': "$gt", '>=': "$gte", '<': "$lt", '<=': "$lte", "=": "eq" }
        const regEx = /\b(<|>|>=|<=|=)\b/g
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)
        //only the numeric values in our model that we are filtering by
        const options = ['price', 'rating']
        filters = filters.split(',').forEach(item => {
            const [field, operator, value] = item.split('-')
            if (options.includes(field)) {
                queryObject[field] = {[operator]: Number(value)}
            }
        });
        console.log(filters)
    }

    console.log(queryObject)
    // we do the sorting this way 
    let result =  Products.find(queryObject);

    // to sort our response   
    if (sort) {
        const sortList = sort.split(",").join(" ")
        result = result.sort(sortList)
    } else {
       result = result.sort('createdAt')
    }

    //select certain fields
    if (fields) {
      const fieldsList = fields.split(",").join(" ");
      result = result.select(fieldsList);
    } 

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    //set the logic 
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)
    // then we now come here to use the await 
    const products = await result 

    res.status(200).json({ success: true,nbhits: products.length, products  });
}

const getAllProductsStatic = async (req, res) => {

    const products = await Products.find({});
  res.status(200).json({ msg: "testing static product" });
};


module.exports = {
    getAllProducts,
    getAllProductsStatic
}