class ApiFeatures {
    // Define properties with types
    public mongooseQuery: Record<string, any>;
    public queryData: Record<string, any>;

    constructor(mongooseQuery: Record<string, any>, queryData: Record<string, any>) {
        this.mongooseQuery = mongooseQuery;
        this.queryData = queryData;
    }

    paginate() {
        let { size, page } = this.queryData;

        size = size > 0 ? size : 1;
        page = page > 0 ? page : 1;

        this.mongooseQuery.limit(parseInt(size)).skip((parseInt(page) - 1) * parseInt(size));
        return this;
    }

    filter() {
        const excludedQueryParams = ['page', 'size', 'sort', 'fields', 'search'];
        const filterQuery = { ...this.queryData };

        excludedQueryParams.forEach(param => {
            delete filterQuery[param];
        });

        this.mongooseQuery.find(JSON.parse(JSON.stringify(filterQuery).replace(/gt|gte|lt|lte|in|nin|eq|neq/g, match => `$${match}`)));
        return this;
    }

    sort() {
        if (this.queryData.sort) {
            this.mongooseQuery.sort(this.queryData.sort.replaceAll(",", " "));
        }
        return this;
    }

    search() {
        if (this.queryData.search) {
            this.mongooseQuery.find({
                $or: [
                    { name: { $regex: this.queryData.search, $options: "i" } },
                    { description: { $regex: this.queryData.search, $options: "i" } }
                ]
            });
        }
        return this;
    }

    select() {
        if (this.queryData.fields) {
            this.mongooseQuery.select(this.queryData.fields.replaceAll(",", " "));
        }
        return this;
    }
}

export default ApiFeatures;
