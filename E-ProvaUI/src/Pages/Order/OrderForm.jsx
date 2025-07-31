import {
  Box,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import { useContext } from "react";
import * as Yup from "yup";
import { OrderContext } from "../../Func/context/OrderContextProvider";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom"; // لو بتستخدم React Router v6
import { useQueryClient } from "@tanstack/react-query";


const validationSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number must contain only numbers")
    .min(10, "Phone number must be at least 10 digits")
    .max(12, "Phone number must be at most 12 digits"),
  shippingAddress: Yup.string()
    .required("Shipping address is required")
    .min(10, "Address must be at least 10 characters"),
  paymentMethod: Yup.string()
    .required("Payment method is required")
    .oneOf(["visa", "cash"], "Invalid payment method"),
});

export default function OrderForm() {
  const { CreateOrder } = useContext(OrderContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const initialValues = {
    phoneNumber: "",
    shippingAddress: "",
    paymentMethod: "visa",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await CreateOrder(
        values.paymentMethod,
        values.phoneNumber,
        values.shippingAddress
      );
      await queryClient.invalidateQueries({ queryKey: ["Cart"] });
      if (values.paymentMethod === "cash") {
        navigate("/e-prova/order/success");
      }
      else if (response?.data?.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      }
      else {
        console.error("Payment URL not found");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 2, p: 3 }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form style={{ width: "100%", display: "flex", gap: "16px" }}>
            {/* Order Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              style={{ width: "50%" }}
            >
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Order Details
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Field
                    as={TextField}
                    name="phoneNumber"
                    label="Phone Number"
                    fullWidth
                    error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                  />
                  <Field
                    as={TextField}
                    name="shippingAddress"
                    label="Shipping Address"
                    fullWidth
                    multiline
                    rows={4}
                    error={
                      touched.shippingAddress && Boolean(errors.shippingAddress)
                    }
                    helperText={
                      touched.shippingAddress && errors.shippingAddress
                    }
                  />
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Payment Method</FormLabel>
                    <Field as={RadioGroup} name="paymentMethod">
                      <FormControlLabel
                        value="visa"
                        control={<Radio />}
                        label="Visa"
                      />
                      <FormControlLabel
                        value="cash"
                        control={<Radio />}
                        label="Cash"
                      />
                    </Field>
                    {touched.paymentMethod && errors.paymentMethod && (
                      <Typography color="error" variant="caption">
                        {errors.paymentMethod}
                      </Typography>
                    )}
                  </FormControl>
                </Box>
              </Paper>
            </motion.div>

            {/* Cart Details Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ width: "50%" }}
            >
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Cart Details
                </Typography>
                <Typography variant="body1">
                  Your cart items will appear here
                </Typography>
                <Box
                  sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <ScaleLoader color="#fff" size={8} />
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  </motion.div>
                </Box>
              </Paper>
            </motion.div>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
