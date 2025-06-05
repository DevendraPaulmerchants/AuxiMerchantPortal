// import style from "../MerchantManagement/Merchants.module.css";
import style from "../Agent/Merchants.module.css";
import style1 from "./Transaction.module.css";
import { IoMdClose } from "react-icons/io";

function MetalDetails({ close, selectedMetal }) {
    document.body.style.overflow = "hidden";
    console.log(selectedMetal);

    return <>
        <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container} style={{ width: "80%" }}>
                <div className={style.add_merchants_header}>
                    <h2>Metal Details</h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                {/* -------------- Customer Details -------------- */}
                <div className={style1.customer_detail_container}>
                    <h2>Customer Details:</h2>
                    <table className={style.merchant_details_page_table}>
                        <tbody>
                            <tr className={style.merchant_details_page_row}>
                                <td>
                                    <h4 className={style.merchant_name}>Name:
                                        <span>
                                            {selectedMetal?.customer_name || "Amar Ojha"}
                                        </span>
                                    </h4>
                                </td>
                                <td>
                                    <h4 className={style.merchant_name}>Email:
                                        <span>
                                            {selectedMetal?.emil || "amarojha2112@gmail.com"}
                                        </span>
                                    </h4>
                                </td>
                                <td>
                                    <h4 className={style.merchant_name}>Mobile:
                                        <span>
                                            {selectedMetal?.phone || "+91-5667678967"}
                                        </span>
                                    </h4>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* --------- Merchant Details --------------- */}
                <div className={style1.customer_detail_container}>
                    <h2>Merchant Details:</h2>
                    <table className={style.merchant_details_page_table}>
                        <tbody>
                            <tr className={style.merchant_details_page_row}>
                                <td>
                                    <h4 className={style.merchant_name}>Name:
                                        <span>
                                            {selectedMetal?.merchant_name}
                                        </span>
                                    </h4>
                                </td>
                                <td>
                                    <h4 className={style.merchant_name}>Price/gm:
                                        <span>
                                            {parseFloat(selectedMetal?.metal_price_per_gram).toFixed(2)}
                                        </span>
                                    </h4>
                                </td>
                                <td>
                                    <h4 className={style.merchant_name}>Quantity (in gm):
                                        <span>
                                            {parseFloat(selectedMetal?.metal_quantity_grams)}
                                        </span>
                                    </h4>
                                </td>
                                <td>
                                    <h4 className={style.merchant_name}>Margin(%):
                                        <span>
                                            {parseFloat(selectedMetal?.merchant_margin).toFixed(2)}
                                        </span>
                                    </h4>
                                </td>
                                <td>
                                    <h4 className={style.merchant_name}>Profit:
                                        <span>
                                            {parseFloat(selectedMetal?.merchant_profit).toFixed(2)}
                                        </span>
                                    </h4>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* ------------- Payment Details ---------- */}
                <div className={style1.customer_detail_container}>
                    <h2>Payment Details:</h2>
                    <table className={style.merchant_details_page_table}>
                        <tbody>
                            <tr className={style.merchant_details_page_row}>
                                <td>
                                    <h4 className={style.merchant_name}>Payment Mode:
                                        <span>
                                            {selectedMetal?.payment_mode}
                                        </span>
                                    </h4>
                                </td>
                                <td>
                                    <h4 className={style.merchant_name}>Customer Payment Status:
                                        <span>
                                            {selectedMetal?.customer_payment_status}
                                        </span>
                                    </h4>
                                    {selectedMetal?.customer_payment_status !== 'COMPLETED' &&
                                        <h4 className={style.merchant_name}>Payment Failure Reason:
                                            <span>
                                                {selectedMetal?.payment_failure_reason}
                                            </span>
                                        </h4>
                                    }
                                </td>
                                <td>
                                    <h4 className={style.merchant_name}>Customer Payment referenceId:
                                        <span>
                                            {selectedMetal?.customer_payment_reference || "UPI1256789"}
                                        </span>
                                    </h4>
                                    <h4 className={style.merchant_name}>PG Payment referenceId:
                                        <span>
                                            {selectedMetal?.pg_transaction_id || "UPI5685678"}
                                        </span>
                                    </h4>
                                </td>
                                <td>
                                    <h4 className={style.merchant_name}>Requested date:
                                        <span>
                                            {selectedMetal?.created_at?.split("T")[0]}
                                        </span>
                                    </h4>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* ------------- Platform Details --------- */}
                {/* <div className={style1.customer_detail_container}>
                    <h2>Services Charges:</h2>
                    <table className={style.merchant_details_page_table}>
                        <tbody>
                            <tr className={style.merchant_details_page_row}>
                                <td>
                                    <h4 className={style.merchant_name}>Plateform fee:
                                        <span>
                                            {parseFloat(selectedMetal?.platform_charge_fee).toFixed(2)}
                                        </span>
                                    </h4>
                                </td>
                                <td>
                                    <h4 className={style.merchant_name}>GST(%):
                                        <span>
                                            {parseFloat(selectedMetal?.gst).toFixed(2)}
                                        </span>
                                    </h4>
                                </td>
                                <td>
                                    <h4 className={style.merchant_name}>Margin(%):
                                        <span>
                                            {parseFloat(selectedMetal?.platform_margin).toFixed(2)}
                                        </span>
                                    </h4>
                                </td>
                                <td>
                                    <h4 className={style.merchant_name}>Profit:
                                        <span>
                                            {parseFloat(selectedMetal?.platform_profit).toFixed(2)}
                                        </span>
                                    </h4>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div> */}
                {/* ------------------ Price Details ---------- */}
                <div className={style1.customer_detail_container}>
                    <h2>Cost breakdown:</h2>
                    <table className={style.merchant_details_page_table}>
                        <tbody>
                            <tr className={style.merchant_details_page_row}>
                                <td>
                                    <h4 className={style.merchant_name}>Total Price(without GST):
                                        <span>
                                            {parseFloat(selectedMetal?.total_amount_before_tax).toFixed(2)}
                                        </span>
                                    </h4>
                                </td>
                                <td>
                                    <h4 className={style.merchant_name}>Total Price(with GST):
                                        <span>
                                            <b>{parseFloat(selectedMetal?.total_amount_after_tax).toFixed(2)}</b>
                                        </span>
                                    </h4>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>
}

export default MetalDetails; 