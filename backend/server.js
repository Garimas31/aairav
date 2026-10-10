require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  "https://aairav-p5abfx64s-garima-sharmas-projects.vercel.app/",
  "https://aairav.vercel.app",
  "http://localhost:5500",
  "http://127.0.0.1:5500"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn("CORS blocked origin:", origin);
    return callback(new Error("Origin not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204
};

// Apply middleware before all routes
app.use(cors(corsOptions));
app.use(express.json());

// Resend email client
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Health check
app.get("/", (req, res) => {
  res.status(200).send("Aairav Minerals backend is running");
});

// Products endpoint
// Connect this route to your actual product data if required.
app.get("/api/products", (req, res) => {
  res.status(501).json({
    success: false,
    message: "Product data route needs to be connected to your product source."
  });
});

// Quotation/contact form
app.post("/send-email", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      product,
      quantity,
      unit,
      requirements,
      message
    } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required."
      });
    }

    if (!resend || !process.env.TO_EMAIL) {
      console.error("Missing RESEND_API_KEY or TO_EMAIL configuration.");

      return res.status(500).json({
        success: false,
        message: "Email service is not configured."
      });
    }

    const { data, error } = await resend.emails.send({
      from: "Aairav Minerals <onboarding@resend.dev>",
      to: [process.env.TO_EMAIL],
      replyTo: email,
      subject: `Quotation Enquiry: ${name}`,
      text: `
New quotation enquiry from Aairav Minerals website

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Product: ${product || "Not specified"}
Quantity: ${quantity || "Not specified"}
Unit: ${unit || "Not specified"}
Requirements: ${requirements || "Not specified"}
Message: ${message || "Not provided"}
      `
    });

    if (error) {
      console.error("Resend error:", error);

      return res.status(502).json({
        success: false,
        message: "Unable to send email."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quotation enquiry submitted successfully.",
      id: data.id
    });
  } catch (err) {
    console.error("Email server error:", err);

    return res.status(500).json({
      success: false,
      message: "An error occurred while submitting your enquiry."
    });
  }
});

// Handle preflight requests explicitly
app.options(/.*/, cors(corsOptions));

// Start server
app.listen(PORT, () => {
  console.log(`Aairav Minerals backend running on port ${PORT}`);
});



// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const { Resend } = require("resend");

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors({
//   origin: [
//     "https://aairav.vercel.app",
//     "http://localhost:5500",
//     "http://127.0.0.1:5500"
//   ],
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));
// app.use(express.json());

// const resend = new Resend(process.env.RESEND_API_KEY);

// app.get("/", (req, res) => {
//   res.send("Aairav Minerals backend is running");
// });

// app.post("/send-email", async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       phone,
//       product,
//       quantity,
//       unit,
//       requirements,
//       message
//     } = req.body;

//     if (!name || !email) {
//       return res.status(400).json({
//         success: false,
//         message: "Name and email are required."
//       });
//     }

//     if (!process.env.RESEND_API_KEY || !process.env.TO_EMAIL) {
//       return res.status(500).json({
//         success: false,
//         message: "Email service is not configured."
//       });
//     }

//     const { data, error } = await resend.emails.send({
//       from: "Aairav Minerals <onboarding@resend.dev>",
//       to: [process.env.TO_EMAIL],
//       replyTo: email,
//       subject: `Quotation Enquiry: ${name}`,
//       text: `
// New quotation enquiry from Aairav Minerals website

// Name: ${name}
// Email: ${email}
// Phone: ${phone || "Not provided"}
// Product: ${product || "Not specified"}
// Quantity: ${quantity || "Not specified"}
// Unit: ${unit || "Not specified"}
// Requirements: ${requirements || "Not specified"}
// Message: ${message || "Not provided"}
//       `
//     });

//     if (error) {
//       console.error("Resend error:", error);
//       return res.status(502).json({
//         success: false,
//         message: "Unable to send email."
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Quotation enquiry submitted successfully.",
//       id: data.id
//     });
//   } catch (err) {
//     console.error("Email server error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "An error occurred while submitting your enquiry."
//     });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });