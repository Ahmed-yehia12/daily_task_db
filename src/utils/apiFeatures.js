import mongoose from "mongoose";

export class ApiFeatures {
  constructor(mongooseQuery, searchQuery) {
    this.mongooseQuery = mongooseQuery;
    this.searchQuery = searchQuery;
  }
  pagination() {
    if (this.searchQuery.page <= 0) this.searchQuery.page = 1;
    let pageNumber = this.searchQuery.page * 1 || 1;
    let limitPage = 8;
    let skipPage = (pageNumber - 1) * limitPage;

    this.pageNumber = pageNumber;
    this.mongooseQuery.skip(skipPage).limit(limitPage);
    return this;
  }
  filter() {
    let filterObj = { ...this.searchQuery };
    let excludedFields = ["page", "sort", "fields", "name"];
    excludedFields.forEach((val) => {
      delete filterObj[val];
    });
    filterObj = JSON.stringify(filterObj);
    filterObj = filterObj.replace(/(gt|gte|lte|lt)/g, (match) => {
      console.log(match);
      return "$" + match;
    });
    filterObj = JSON.parse(filterObj);
    if (filterObj.employeeId) {
      console.log("EmployeeId type:", typeof filterObj.employeeId);
      console.log("EmployeeId value:", filterObj.employeeId);

      // Remove any quotes if they exist
      const cleanId = filterObj.employeeId.replace(/"/g, "");

      if (/^[0-9a-fA-F]{24}$/.test(cleanId)) {
        filterObj.employeeId = new mongoose.Types.ObjectId(cleanId);
      } else {
        throw new Error(`Invalid ObjectId format: ${cleanId}`);
      }
    }
    console.log(filterObj);
    this.mongooseQuery.find(filterObj);
    return this;
  }
}
