function buildOpenApiSpec({ serverUrl }) {
  return {
    openapi: "3.0.3",
    info: {
      title: "Mini SaaS Task Management API",
      version: "1.0.0"
    },
    servers: [{ url: serverUrl }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        Error: {
          type: "object",
          properties: { message: { type: "string" } }
        },
        AuthResponse: {
          type: "object",
          properties: {
            user: { $ref: "#/components/schemas/User" },
            token: { type: "string" }
          }
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", nullable: true },
            email: { type: "string" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" }
          }
        },
        Task: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string" },
            description: { type: "string", nullable: true },
            status: { type: "string", enum: ["PENDING", "COMPLETED"] },
            userId: { type: "string", format: "uuid" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" }
          }
        }
      }
    },
    paths: {
      "/api/auth/signup": {
        post: {
          summary: "Signup",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                    password: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } },
            "400": { description: "Bad Request", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
            "409": { description: "Conflict", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
          }
        }
      },
      "/api/auth/login": {
        post: {
          summary: "Login",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: { email: { type: "string" }, password: { type: "string" } }
                }
              }
            }
          },
          responses: {
            "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
          }
        }
      },
      "/api/auth/me": {
        get: {
          summary: "Get current user",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": { description: "OK", content: { "application/json": { schema: { type: "object", properties: { user: { $ref: "#/components/schemas/User" } } } } } },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
          }
        }
      },
      "/api/tasks": {
        get: {
          summary: "List my tasks",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "OK",
              content: { "application/json": { schema: { type: "object", properties: { tasks: { type: "array", items: { $ref: "#/components/schemas/Task" } } } } } }
            },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
          }
        },
        post: {
          summary: "Create a task",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title"],
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            "201": { description: "Created", content: { "application/json": { schema: { type: "object", properties: { task: { $ref: "#/components/schemas/Task" } } } } } },
            "400": { description: "Bad Request", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
          }
        }
      },
      "/api/tasks/{id}/status": {
        patch: {
          summary: "Update task status",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: { status: { type: "string", enum: ["PENDING", "COMPLETED"] } }
                }
              }
            }
          },
          responses: {
            "200": { description: "OK", content: { "application/json": { schema: { type: "object", properties: { task: { $ref: "#/components/schemas/Task" } } } } } },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
            "404": { description: "Not Found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
          }
        }
      },
      "/api/tasks/{id}": {
        delete: {
          summary: "Delete a task",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "204": { description: "No Content" },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
            "404": { description: "Not Found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
          }
        }
      }
    }
  };
}

module.exports = { buildOpenApiSpec };

