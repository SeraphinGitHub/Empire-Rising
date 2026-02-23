"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// =====================================================================
// User Class
// =====================================================================
class User {
    id;
    name;
    constructor(params) {
        this.id = params.id;
        this.name = params.name;
    }
}
exports.User = User;
