import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce API",
      version: "1.0.0",
      description: `
## E-Commerce REST API

Simple clean API for auth, brands, categories, subcategories.
      `,
    },

    servers: [
      { url: "http://localhost:3000/api" },
    ],

    components: {
      // 🔐 Auth (cookie)
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },

      // 🔹 Schemas
      schemas: {
        // ✅ Common
        SuccessMessage: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Done successfully" },
          },
        },

        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error occurred" },
          },
        },

        CloudImage: {
          type: "object",
          properties: {
            publicId: { type: "string" },
            secure_url: { type: "string" },
          },
        },

        // ✅ Auth
        RegisterRequest: {
          type: "object",
          required: ["email", "userName", "password"],
          properties: {
            email: { type: "string" },
            userName: { type: "string" },
            password: { type: "string" },
          },
        },

        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string" },
            password: { type: "string" },
          },
        },

        LoginResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            results: {
              type: "object",
              properties: {
                token: { type: "string" },
              },
            },
          },
        },

        ForgetCodeRequest: {
          type: "object",
          properties: {
            email: { type: "string" },
          },
        },

        ResetPasswordRequest: {
          type: "object",
          required: ["email", "password", "forgetcode"],
          properties: {
            email: { type: "string" },
            password: { type: "string" },
            forgetcode: { type: "string" },
          },
        },

        // ✅ Brand
        Brand: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            slug: { type: "string" },
            image: { $ref: "#/components/schemas/CloudImage" },
          },
        },

        BrandListResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            totalDoc: { type: "number" },
            totalPages: { type: "number" },
            currentPage: { type: "number" },
            results: {
              type: "array",
              items: { $ref: "#/components/schemas/Brand" },
            },
          },
        },

        // ✅ Category
        Category: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            slug: { type: "string" },
            image: { $ref: "#/components/schemas/CloudImage" },
          },
        },

        CategoryListResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            results: {
              type: "array",
              items: { $ref: "#/components/schemas/Category" },
            },
          },
        },

        // ✅ SubCategory
        SubCategory: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            slug: { type: "string" },
            category: { type: "string" },
            image: { $ref: "#/components/schemas/CloudImage" },
          },
        },

        SubCategoryListResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            results: {
              type: "array",
              items: { $ref: "#/components/schemas/SubCategory" },
            },
          },
        },
      },

      // 🔹 Reusable params
      parameters: {
        IdParam: {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
        PageParam: {
          name: "page",
          in: "query",
          schema: { type: "number", default: 1 },
        },
        LimitParam: {
          name: "limit",
          in: "query",
          schema: { type: "number", default: 10 },
        },
      },

      // 🔹 Responses
      responses: {
        Unauthorized: {
          description: "Not logged in",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        Forbidden: {
          description: "Not allowed",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        InternalError: {
          description: "Server error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  apis: ["./routes/*.js"],
};

export default swaggerJSDoc(options);