import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { baseURL } from "./APIconfig.ts"
import '/src/css/Color.scss';
import {User} from './UserInterface.ts'
import { useLoginStore } from './LoginState.ts';

import { Paper, FormGroup, TextField, Button } from '@mui/material';
import { FormHelperText } from '@mui/material';


function UserInformation() {

    const { User } = useLoginStore();
    const navigate = useNavigate()

    const [inputImage, setInputImage] = useState("");

    const [email] = useState(User.email);
    
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [passwordErrorText, setPasswordErrorText] = useState<string>('');
    
    const [name, setName] = useState(User.name);
    const [nameError, setNameError] = useState<boolean>(false);
    const [nameErrorText, setNameErrorText] = useState<string>('');
    
    const [phoneNumber, setPhoneNumber] = useState<string>(User.phoneNumber);
    const [phoneNumberError, setPhoneNumberError] = useState<boolean>(false);
    const [phoneNumberErrorText, setPhoneNumberErrorText] = useState<string>('');


    // const [address, setAddress] = useState(User.addresses[0]);
    const [addressError, setAddressError] = useState<boolean>(false);
    const [addressErrorText, setAddressErrorText] = useState<string>('');
    

    // 初始化一個長度為10的列表，初始值為空字符串
    const emptyAddresses = Array(10).fill('');

    // 使用 User.addresses 的數據填充這個列表
    const initialAddresses = emptyAddresses.map((_, index) => 
        User.addresses && index < User.addresses.length ? User.addresses[index] : ''
    );

    const [addresses, setAddresses] = useState(initialAddresses);

    // 添加新地址
    const addAddress = () => {
        if (addresses.length < 10) {
            setAddresses([...addresses, '']);
        }
    };

    // 移除特定索引的地址
    const removeAddress = (index: number) => {
        if (addresses.length > 1) {
            const newAddresses = addresses.filter((_, addrIndex) => addrIndex !== index);
            setAddresses(newAddresses);
        }
    };  

    // 处理地址输入或添加新地址
    const handleAddressChangeOrAdd = (index: number, newValue: string) => {
        const updatedAddresses = [...addresses];
        updatedAddresses[index] = newValue;
        setAddresses(updatedAddresses);
    };    

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : undefined;

        if (file) {
            const reader = new FileReader();

            reader.onload = (e: ProgressEvent<FileReader>) => {
                const base64String = e.target?.result as string;
                setInputImage(base64String);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        handleSignup()

    }

    const handleSignup = () => {
        let error : boolean = false
        //passward為空判斷
        if(password == ''){
            setPasswordError(true)
            setPasswordErrorText("請輸入密碼")
            error =  true
        }
        else{
            setPasswordError(false)
            setPasswordErrorText("")
        }
        //name為空判斷
        if(name == ''){
            setNameError(true)
            setNameErrorText("請輸入姓名")
            error =  true
        }
        else{
            setNameError(false)
            setNameErrorText("")
        }
        //phonenumber為空判斷
        if(phoneNumber == ''){
            setPhoneNumberError(true)
            setPhoneNumberErrorText("請輸入電話")
            error =  true
        }
        else{
            setPhoneNumberError(false)
            setPhoneNumberErrorText("")
        }
        //address為空判斷
        // if(addresses[0].trim() == ''){
        //     setAddressError(true);
        //     setAddressErrorText("請至少輸入一個地址");
        //     error = true;
        // }
        // else{
        //     setAddressError(false);
        //     setAddressErrorText("");
        // }        
        if (addresses.length === 0 || addresses.every(address => address.trim() === '')) {
            setAddressError(true);
            setAddressErrorText("請至少輸入一個地址");
            error = true;
        } 
        else {
            setAddressError(false);
            setAddressErrorText("");
        }

        if (error){
            return;
        }

        axios
        .put<User>(`${baseURL}user/${User.id}`, {
            name: name,
            email: email,
            phoneNumber: phoneNumber,
            password: password,
            avatar: inputImage,
            addresses: addresses        
        })
        .then(() => {
            navigate('/')
        })
        .catch((error) => {
            console.log(error);
            setPasswordError(true)
            setPasswordErrorText("")
            setNameError(true)
            setNameErrorText("")
            setPhoneNumberError(true)
            setPhoneNumberErrorText("")
            setAddressError(true)
            setAddressErrorText("資料格式錯誤")
        });
    }
    
    function HandlePasswordPressEnter(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            document.getElementById("NameInput")?.focus();
        }
    }
    
    function HandleNamePressEnter(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            document.getElementById("PhoneNumberInput")?.focus();
        }
    }
    
    function HandlePhoneNumberPressEnter(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            document.getElementById("AddressInput")?.focus();
        }
    }
    
    function HandleAddressPressEnter(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            document.getElementById("Signup")?.focus();
        }
    }

    console.log(addresses);  // 在 return 語句之前添加這行代碼來檢查 addresses


    return (
        <div className='flex items-center justify-center'>
            <Paper className='bg2 p-10 m-10'>
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label htmlFor="image-upload" className="text-green-500 cursor-pointer">Upload Profile Picture</label>
                        <input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    </div>
                    {inputImage && <img src={inputImage} alt="Profile" className="mb-2" />}
                    <FormGroup>
                        <TextField label="Email" type="email" value={email} disabled
                            color='success' sx={{ mb: 2 }}/>
                        <TextField label="Password" type="password" value={password} 
                            color='success' sx={{ mb: 2 }} 
                            onChange={(e) => setPassword(e.target.value)} onKeyDown={HandlePasswordPressEnter} 
                            error={passwordError} helperText={passwordErrorText} />
                        <TextField label="Name" type="text" value={name} 
                            color='success' sx={{ mb: 2 }}
                            onChange={(e) => setName(e.target.value)} onKeyDown={HandleNamePressEnter} 
                            error={nameError} helperText={nameErrorText} />
                        <TextField label="Phone Number" type="text" value={phoneNumber} 
                            color='success' sx={{ mb: 2 }}
                            onChange={(e) => setPhoneNumber(e.target.value)} onKeyDown={HandlePhoneNumberPressEnter} 
                            error={phoneNumberError} helperText={phoneNumberErrorText} />                        
                        {addresses.map((address, index) => (
                            <div key={`address-field-${index}`} className="flex items-center mb-2">
                                <TextField 
                                    label={`Address ${index + 1}`} 
                                    type="text" 
                                    value={address}
                                    color='success' 
                                    sx={{ mr: 2, flex: 1 }}
                                    onChange={(e) => handleAddressChangeOrAdd(index, e.target.value)}
                                    error={addressError}
                                />
                                <Button onClick={() => removeAddress(index)} color="error" variant="outlined" size="small">
                                    Delete
                                </Button>
                            </div>
                        ))}
                        {addressError && (
                            <FormHelperText
                                error={true}
                                sx={{ 
                                    ml: 2,
                                    mb: 2, 
                                }}
                            >
                                {addressErrorText}
                            </FormHelperText>
                        )}
                        <div className="flex justify-between">
                            <Button type="submit" color="success" variant="contained" sx={{ textTransform: 'none' }}>Submit</Button>
                            {addresses.length < 10 && (
                                <Button onClick={addAddress} color="primary" variant="outlined" sx={{ textTransform: 'none' }}>
                                    Add Address
                                </Button>
                            )}
                        </div>
                    </FormGroup>
                </form>
            </Paper>
        </div>
    );
    
}

export default UserInformation;
