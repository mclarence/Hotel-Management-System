import {Button, Dialog, DialogContent, Stack, Tab, Tabs, TextField} from "@mui/material";
import {ApiResponse, Guest, PaymentMethod} from "@hotel-management-system/models";
import {DialogHeader} from "../../../../util/components/DialogHeader";
import React, {SyntheticEvent, useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import AddCardIcon from '@mui/icons-material/AddCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import dayjs from "dayjs";
import {addPaymentMethod} from "../../../api/resources/paymentMethods";
import {PaymentMethodTypes} from "../../../../../../../libs/models/src/lib/enums/PaymentMethodTypes";
import appStateSlice from "../../../redux/slices/AppStateSlice";
import {useAppDispatch} from "../../../redux/hooks";
import {makeApiRequest} from "../../../api/makeApiRequest";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export const AddPaymentMethodDialog = (props: {
    open: boolean,
    setOpen: (open: boolean) => void,
    guest: Guest | null,
    fetchPaymentMethods: () => void
}) => {
    const [value, setValue] = useState(0);
    const [creditCardNumber, setCreditCardNumber] = useState("")
    const [creditCardCVV, setCreditCardCVV] = useState("")
    const [creditCardExpirationDate, setCreditCardExpirationDate] = useState(new Date())
    const [creditCardHolderName, setCreditCardHolderName] = useState("")
    const [bankAccountNumber, setBankAccountNumber] = useState("")
    const [bankBSB, setBankBSB] = useState<string>("")
    const [addCardButtonDisabled, setAddCardButtonDisabled] = useState<boolean>(true)
    const [addBankButtonDisabled, setAddBankButtonDisabled] = useState<boolean>(true)
    const dispatch = useAppDispatch();

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue)
    };

    useEffect(() => {
        if (
            creditCardNumber !== "" &&
            creditCardCVV !== "" &&
            creditCardExpirationDate !== null &&
            creditCardHolderName !== ""
        ) {
            setAddCardButtonDisabled(false)
        } else {
            setAddCardButtonDisabled(true)
        }

    }, [creditCardNumber, creditCardCVV, creditCardExpirationDate, creditCardHolderName])

    useEffect(() => {
        if (
            bankAccountNumber !== "" &&
            bankBSB !== ""
        ) {
            setAddBankButtonDisabled(false)
        } else {
            setAddBankButtonDisabled(true)
        }

    }, [bankAccountNumber, bankBSB])

    const handleAddPaymentMethod = (paymentMethod: PaymentMethod) => {
        makeApiRequest<PaymentMethod>(
            addPaymentMethod(paymentMethod),
            dispatch,
            (data) => {
                props.setOpen(false)
                props.fetchPaymentMethods()
                dispatch(
                    appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: "Payment method added successfully.",
                        severity: "success",
                    })
                );
            }
        )
    }

    const handleAddBank = () => {
        const newPaymentMethod: PaymentMethod = {
            guestId: props.guest?.guestId!,
            type: PaymentMethodTypes.BANK_ACCOUNT,
            bankAccountNumber: bankAccountNumber,
            bankBSB: bankBSB,
        }

        handleAddPaymentMethod(newPaymentMethod)
    }

    const handleAddCard = () => {
        const newPaymentMethod: PaymentMethod = {
            guestId: props.guest?.guestId!,
            type: PaymentMethodTypes.CREDIT_CARD,
            cardNumber: creditCardNumber,
            cardCVV: creditCardCVV,
            cardExpiration: creditCardExpirationDate,
            cardHolderName: creditCardHolderName,
            bankAccountNumber: "",
            bankBSB: "",
        }

        handleAddPaymentMethod(newPaymentMethod)

    }


    return (
        <Dialog open={props.open}>
            <DialogHeader title={"Add Payment Method"} onClose={() => props.setOpen(false)}/>
            <DialogContent>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Credit/Debit Card" {...a11yProps(0)} />
                        <Tab label="Bank Account" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <Stack direction={"column"} gap={2}>
                        <TextField
                            fullWidth
                            value={creditCardNumber}
                            onChange={(e) => setCreditCardNumber(e.target.value)}
                            label={"Credit Card Number"}
                        />
                        <TextField
                            fullWidth
                            value={creditCardCVV}
                            onChange={(e) => setCreditCardCVV(e.target.value)}
                            label={"Credit Card CVV"}
                        />

                        <DatePicker
                            label="Credit Card Expiration Date"
                            format={"MM/YYYY"}
                            value={dayjs(creditCardExpirationDate)}
                            onChange={(newValue) => {
                                if (newValue !== null) {
                                    setCreditCardExpirationDate(newValue.toDate())
                                }
                            }}
                            views={['month', 'year']}
                        />
                        <TextField
                            fullWidth
                            value={creditCardHolderName}
                            onChange={(e) => setCreditCardHolderName(e.target.value)}
                            label={"Credit Card Holder Name"}
                        />
                        <Button variant={"contained"} startIcon={<AddCardIcon/>} disabled={addCardButtonDisabled}
                                onClick={handleAddCard}>
                            Add Card
                        </Button>
                    </Stack>

                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <Stack direction={"column"} gap={2}>
                        <TextField
                            fullWidth
                            value={bankAccountNumber}
                            onChange={(e) => setBankAccountNumber(e.target.value)}
                            label={"Bank Account Number"}
                        />
                        <TextField
                            fullWidth
                            value={bankBSB}
                            onChange={(e) => setBankBSB(e.target.value)}
                            type={"number"}
                            label={"Bank BSB"}
                        />
                        <Button variant={"contained"} startIcon={<AccountBalanceIcon/>} disabled={addBankButtonDisabled}
                                onClick={handleAddBank}>
                            Add Bank
                        </Button>
                    </Stack>
                </CustomTabPanel>
            </DialogContent>
        </Dialog>
    )
        ;
}