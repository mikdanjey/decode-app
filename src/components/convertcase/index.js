import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { InputAdornment } from '@mui/material';
import { SearchOutlined } from '@ant-design/icons';
import { useForm, Controller, useWatch } from "react-hook-form";
import { joiResolver } from '@hookform/resolvers/joi';
import { validationSchema } from './validationSchema';
import base64 from 'base-64';

function Child({ control }) {
    const convertString = useWatch({
        control,
        name: "convertString",
    });
    return <p>Watch: {convertString}</p>;
}

export const ConvertCase = () => {
    const [decodeResult, setDecodeResult] = useState(null);
    const [error, setError] = useState(null);
    const [actionType, setActionType] = useState('');
    const [result, setResult] = useState('');

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            convertString: '',
        },
        shouldFocusError: true,
        shouldUnregister: true,
        shouldUseNativeValidation: false,
        resolver: joiResolver(validationSchema),
    });
    console.log(errors);

    const onSubmit = (values) => {
        const { convertString } = values;
        const data = base64.decode(convertString);
        try {
            const encodeJSON = JSON.parse(data);
            if (typeof (encodeJSON) === 'object') {
                setDecodeResult(JSON.stringify(encodeJSON, null, 2));
                setError(null);
            }
        } catch (error) {
            setDecodeResult(null);
            setError("Please check your endcode data");
        }
    };

    const onTextConvert = handleSubmit(values => {
        const { convertString } = values;
        // result // actionType
        setResult(convertString.toLocaleUpperCase());
    });

    return (
        <Container maxWidth="100%">
            <Box sx={{ m: 1 }}>
                <Typography variant="h5" component="h5">
                    Simply enter your text and choose the case you want to convert it to.
                </Typography>
                <form noValidate onSubmit={handleSubmit(onSubmit)}>

                    <Controller
                        name="convertString"
                        control={control}
                        render={({ field }) =>
                            <TextField
                                fullWidth
                                multiline
                                rows={5}
                                error={errors.convertString?.message}
                                helperText={errors.convertString?.message}
                                size="small"
                                id="convertString"
                                autoComplete={"off"}
                                placeholder="Type or paste your content here"
                                {...field}
                            />
                        }
                    />
                    <Child control={control} />
                    <Stack direction="row" spacing={2}>
                        <Button color="warning" variant="contained" type="button" onClick={() => {
                            reset({ convertString: "" });
                            setActionType('');
                            setResult('');
                        }} align="right">
                            Reset
                        </Button>
                        <Button color="primary" variant="contained" type="button"
                            onClick={event => {
                                setActionType('UPPER_CASE');
                                onTextConvert(event);
                            }}
                        >
                            UPPER CASE
                        </Button>
                    </Stack>
                </form>
                <br />
                <br />
                <TextField
                    fullWidth
                    multiline
                    rows={5}
                    size="small"
                    autoComplete={"off"}
                    placeholder="Result"
                    value={result}
                    inputProps={
                        { readOnly: true, }
                    }
                />
                {decodeResult &&
                    <>
                        <br />
                        <b>Decode Result</b>: <br />
                        <pre><code>{decodeResult}</code></pre>
                    </>
                }
                {error &&
                    <>
                        <br />
                        <b>Error</b>: {error}
                    </>
                }
            </Box>
        </Container>
    );
};
