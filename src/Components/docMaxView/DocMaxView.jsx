import style from './DocMaxView.module.css';
import { IoMdArrowRoundBack } from 'react-icons/io';
import PropTypes from 'prop-types';

const DocMaxView = ({ doc,close }) => {
    return (
        <div className={style.document_parent}>
            <div className={style.document_conatainer}>
                <button className='back_button' onClick={()=>close()}><IoMdArrowRoundBack /></button>
                <div className={style.iframe_conatainer}>
                    <iframe
                        src={doc}
                        title='Attachment'
                    />
                </div>
            </div>
        </div>
    )
}
export default DocMaxView;

DocMaxView.propTypes={
    doc:PropTypes.string.isRequired,
    close:PropTypes.func.isRequired
}
