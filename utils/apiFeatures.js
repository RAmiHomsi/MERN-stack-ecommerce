class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    fliter() {
        // 1) filtration without some fields
        const queryStringObj = { ...this.queryString };
        const excludesFields = ["page", "sort", "limit", "fields"];
        excludesFields.forEach((field) => {
            delete queryStringObj[field];
        });

        // 2) filtration mongoDB
        let querystr = JSON.stringify(queryStringObj);
        querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(querystr));
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortedby = this.queryString.sort.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sortedby);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
        }
        return this;
    }

    limitFields() {
        //limted fields to show in respons
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
            this.mongooseQuery = this.mongooseQuery.select('-__v');
        }
        return this;
    }

    search(modelName) {
        if (this.queryString.keyword) {
            let query = {};
            if (modelName === 'Products') {
                query.$or = [
                    { title: { $regex: this.queryString.keyword, $options: 'i' } },
                    { description: { $regex: this.queryString.keyword, $options: 'i' } },
                ];
            } else {
                query = { name: { $regex: this.queryString.keyword, $options: 'i' } };
            }

            this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
    }

    paginate(countDocuments) {
        const page = parseInt(this.queryString.page) || 1;
        // anothor way to convert string to number is to multiple it by 1 ex: req.query.limit * 1 
        const limit = this.queryString.limit * 1 || 50;
        const skip = (page - 1) * limit; //count of documents showed in a single page
        const endIndex = page * limit; //index of last element in a single page

        // Pagination result
        const pagination = {};
        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil(countDocuments / limit); //number of pages depending on number of elements ex: 50elem/10 = 5 pages

        // next page
        if (endIndex < countDocuments) {
            pagination.next = page + 1;
        }
        if (skip > 0) {
            pagination.prev = page - 1;
        }

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        this.paginationResult = pagination; // "this" refers to that object calling this class and adding prop paginationResult
        return this;
    }
}

module.exports = ApiFeatures;