import { FaFileDownload, FaFileUpload } from 'react-icons/fa';
import style from './AddInternalAgent.module.css';
import style1 from '../Merchants.module.css';
import { useRef, useState } from 'react';
import { useContextData } from '../../Context/Context';
import { APIPath } from '../../ApIPath/APIPath';
import { IoMdAdd } from 'react-icons/io';
import InternalAgentForm from './InternalAgentForm';

function AddInternalAgent({ close }) {
    const { merchantId, token } = useContextData();
    const fileInputRef = useRef(null);
    const [uploadError, setUploadError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOneAgent, setIsOneAgent] = useState(false);

    const expectedFileName = 'Internal_Agent.xlsx';

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = `/Internal_Agent.xlsx`;
        link.download = expectedFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.name !== expectedFileName) {
            setUploadError(`Please upload the same file as you downloaded: ${expectedFileName}`);
            setSelectedFile(null);
        } else {
            setUploadError('');
            setSelectedFile(file);
            console.log("File selected:", file.name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedFile) {
            alert("Please upload the correct file before submitting.");
            return;
        }
        console.log("Submitting:", selectedFile.name);
        setLoading(true)
        const formData = new FormData();
        formData.append('merchantId', merchantId);
        formData.append('file', selectedFile);
        fetch(`${APIPath}merchant-service/internal-agent/upload`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            method: 'POST',
            body: formData,
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status_code !== 200) {
                    alert(data.message);
                    return
                }
                console.log(data);
                alert(data.message);
                close();

            }).catch((err) => {
                console.error(err.message)
            }).finally(() => setLoading(false))
    };

    return (
            <div>
                {!isOneAgent &&
                    <div className={style.addInternalAgentContainer}>
                        <div className={style.internalAgent_txt}>
                            <p>
                                Please download the Excel format provided, fill in the details exactly as per the given structure,
                                and then upload the same file once completed. Do not modify the format or column headers.
                            </p>
                        </div>

                        <div className={style.addInternalAgent_files}>
                            <div
                                className={style.addInternalAgent_files_format}
                                onClick={handleDownload}
                            >
                                <FaFileDownload title="Download Format" fontSize={24} />
                                <p>Download</p>
                            </div>

                            <div
                                className={style.addInternalAgent_files_format}
                                onClick={handleUploadClick}
                            >
                                <FaFileUpload title="Upload Excel" fontSize={24} />
                                <p>Upload</p>
                                <input required
                                    type="file"
                                    accept=".xlsx"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />

                            </div>
                            {uploadError && (
                                <p style={{ color: 'red', marginTop: '10px' }}>{uploadError}</p>
                            )}

                        </div>

                        {selectedFile && (
                            <p style={{ color: 'green', marginTop: '10px' }}>
                                Selected file: {selectedFile.name}
                            </p>
                        )}
                    </div>
                }
                <br />
                <div className={style.add_one_by_one}>
                    {!isOneAgent ? <p>Want to Add One(Single) Internal Agent</p> : <p>Want to upload file</p>}
                    <div className={style.two_btn_container}>
                        {!isOneAgent &&
                            <p className={style1.primary_login_btn} onClick={() => setIsOneAgent(true)}><span><IoMdAdd /></span> <span>Add</span></p>
                        }
                        {isOneAgent &&
                            <p className={style1.primary_login_btn} onClick={() => setIsOneAgent(false)}><span><IoMdAdd /></span> <span>Upload File</span></p>
                        }

                    </div>
                    {isOneAgent && <InternalAgentForm close={close} />}
                </div>
                {!isOneAgent &&
                    <div>
                        {loading ? <p>Loading...</p> :
                            <button className={style1.primary_login_btn} disabled={!selectedFile || uploadError}
                                type='submit' onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        }
                    </div>
                }
            </div>
    );
}

export default AddInternalAgent;
