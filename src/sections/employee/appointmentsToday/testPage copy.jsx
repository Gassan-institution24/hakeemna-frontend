// import * as Yup from 'yup';
// import { useForm } from 'react-hook-form';
// import { enqueueSnackbar } from 'notistack';
// import { yupResolver } from '@hookform/resolvers/yup';

// import FormControlLabel from '@mui/material/FormControlLabel';
// import { Button, Dialog, Checkbox, DialogActions, DialogContent } from '@mui/material';

// import { useBoolean } from 'src/hooks/use-boolean';

// import axiosInstance from 'src/utils/axios';

// import Iconify from 'src/components/iconify';
// import { RHFTextField } from 'src/components/hook-form';
// import FormProvider from 'src/components/hook-form/form-provider';

// questions in super admin
// export default function TestPage() {
//   const onSubmit = async (submitdata) => {
//     try {
//       await axiosInstance.post('/api/generlaCL', submitdata);
//       enqueueSnackbar('new question created successfully', { variant: 'success' });
//       dialog.onFalse();
//       reset();
//     } catch (error) {
//       console.error(error.message);
//     }
//   };
//   const questionSchema = Yup.object().shape({
//     question_arabic: Yup.string(),
//     question_english: Yup.string(),
//   });
//   const defaultValues = {
//     question_arabic: '',
//     question_english: '',
//   };

//   const dialog = useBoolean();
//   const methods = useForm({
//     mode: 'onTouched',
//     resolver: yupResolver(questionSchema),
//     defaultValues,
//   });

//   const {
//     reset,
//     handleSubmit,
//     formState: { isSubmitting },
//   } = methods;
//   return (
//     <>
//       <FormControlLabel label="Diabetes" control={<Checkbox size="small" />} />
//       <br />
//       <Button variant="outlined" color="success" onClick={dialog.onTrue} sx={{ mt: 1 }}>
//         Edit Check list
//         <Iconify icon="ic:outline-edit-note" sx={{ ml: 0.5 }} />
//       </Button>

//       <Dialog open={dialog.value} onClose={dialog.onFalse}>
//         <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
//           <DialogContent>
//             <br />
//             <br />
//             <RHFTextField lang="ar" name="question_arabic" label="question_arabic" />
//             <br />
//             <br />
//             <RHFTextField lang="en" name="question_english" label="question_english" />
//           </DialogContent>
//           <DialogActions>
//             <Button variant="outlined" color="inherit" onClick={dialog.onFalse}>
//               {/* {t('Cancel')} */}Cancel
//             </Button>

//             <Button type="submit" variant="contained" loading={isSubmitting}>
//               {/* {t('Upload')} */}Upload
//             </Button>
//           </DialogActions>
//         </FormProvider>
//       </Dialog>
//     </>
//   );
// }



// // questions in service unit 
// import * as Yup from 'yup';
// import { useForm } from 'react-hook-form';
// import { enqueueSnackbar } from 'notistack';
// import { yupResolver } from '@hookform/resolvers/yup';

// import FormControlLabel from '@mui/material/FormControlLabel';
// import {
//   Button,
//   Dialog,
//   Checkbox,
//   MenuItem,
//   Typography,
//   DialogTitle,
//   DialogActions,
//   DialogContent,
// } from '@mui/material';

// import { useBoolean } from 'src/hooks/use-boolean';

// import axiosInstance from 'src/utils/axios';

// import { useGetGeneralCheckListData } from 'src/api/check_listQ';

// import Iconify from 'src/components/iconify';
// import FormProvider from 'src/components/hook-form/form-provider';
// import { RHFSelect, RHFTextField } from 'src/components/hook-form';

// // defaultChecked
// export default function TestPage() {
//   const dialog = useBoolean();
//   const CheckListData = useGetGeneralCheckListData();
//   console.log(CheckListData?.CheckListData, 'sdsdlksdls');
//   const onSubmit = async (submitdata) => {
//     try {
//       await axiosInstance.post('/api/localCL', submitdata);
//       enqueueSnackbar('new question created successfully', { variant: 'success' });
//       dialog.onFalse();
//       reset();
//     } catch (error) {
//       console.error(error.message);
//     }
//   };
//   const questionSchema = Yup.object().shape({
//     question: Yup.string(),
//     question_arabic: Yup.string(),
//     question_english: Yup.string(),
//   });
//   const defaultValues = {
//     question: '',
//     question_arabic: '',
//     question_english: '',
//   };

//   const methods = useForm({
//     mode: 'onTouched',
//     resolver: yupResolver(questionSchema),
//     defaultValues,
//   });

//   const {
//     reset,
//     handleSubmit,
//     formState: { isSubmitting },
//   } = methods;
//   return (
//     <>
//       <FormControlLabel label="Diabetes" control={<Checkbox size="small" />} />
//       <br />
//       <Button variant="outlined" color="success" onClick={dialog.onTrue} sx={{ mt: 1 }}>
//         Edit Check list
//         <Iconify icon="ic:outline-edit-note" sx={{ ml: 0.5 }} />
//       </Button>

//       <Dialog open={dialog.value} onClose={dialog.onFalse}>
//         <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
//           <DialogContent>
//           <DialogTitle sx={{ color: 'red', position: 'relative', top: '10px' }}>
//             NOTE
//           </DialogTitle>
//             <Typography sx={{ mb: 5, fontSize: 14 }}>A field to add questions that can be asked to the patient while managing the appointment</Typography>
//             <RHFTextField
//               lang="ar"
//               name="question_arabic"
//               label="question_arabic"
//               sx={{ mb: 2}}
//             />

//             <RHFTextField
//               lang="en"
//               name="question_english"
//               label="question_english"
//               sx={{ mb: 2 }}
//             />
//             <RHFSelect
//               label="or choose a question to add"
//               fullWidth
//               name="question"
//               PaperPropsSx={{ textTransform: 'capitalize' }}
//               sx={{ mb: 2 }}
//             >
//               {CheckListData?.CheckListData?.map((test, idx) => (
//                 <MenuItem lang="ar" value={test?._id} key={idx} sx={{ mb: 1 }}>
//                   {test?.question_english}
//                 </MenuItem>
//               ))}
//             </RHFSelect>
//           </DialogContent>
//           <DialogActions>
//             <Button variant="outlined" color="inherit" onClick={dialog.onFalse}>
//               {/* {t('Cancel')} */}Cancel
//             </Button>

//             <Button type="submit" variant="contained" loading={isSubmitting}>
//               {/* {t('Upload')} */}Upload
//             </Button>
//           </DialogActions>
//         </FormProvider>
//       </Dialog>
//     </>
//   );
// }




import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import Paper from '@mui/material/Paper';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Radio,
  TextField,
  Typography,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';

import { useGetlocalCheckListData } from 'src/api/check_listQ';

// defaultChecked
export default function TestPage() {
  const dialog = useBoolean();
  const localListData = useGetlocalCheckListData();
  console.log(localListData, 'sdsdlksdls');
  const onSubmit = async (submitdata) => {
    try {
      await axiosInstance.post('/api/answersandquestiones', submitdata);
      enqueueSnackbar('new question created successfully', { variant: 'success' });
      dialog.onFalse();
      reset();
    } catch (error) {
      console.error(error.message);
    }
  };
  const questionSchema = Yup.object().shape({
    question: Yup.string(),
    answer: Yup.string(),
  });
  const defaultValues = {
    question: '',
    answer: '',
  };

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(questionSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  return (
    <Box component={Paper} sx={{ p: 1 }}>
      {localListData?.localListData?.map((info, i) => (
        <Box sx={{ display: 'block' }}>
          {info?.answer_way === 'Text' && (
            <>
              <TextField
                sx={{ m: 2, width: '80%' }}
                fullWidth
                name=''
                label={info?.question_english || info?.question?.question_english}
                // value={height}
                // onChange={handleHeightChange}
              />
              <Divider />
            </>
          )}
          {/* {info?.answer_way === 'Check List' && (
            <>
              <Typography sx={{ m: 2 }}>
                {info?.question_english || info?.question?.question_english}{' '}
                <FormControlLabel
                  value="p"
                  control={<Checkbox size="small" sx={{display:'block'}}/>}
                  label="The answers"
                />
              </Typography>
              <Divider />
            </>
          )}
          {info?.answer_way === 'Yes No' && (
            <>
              <Typography sx={{ m: 2 }}>
                {info?.question_english || info?.question?.question_english}{' '}
                <FormControlLabel value="p" control={<Radio size="small" />} label="The answers" />
              </Typography>
              <Divider />
            </>
          )} */}
        </Box>
      ))}

      <Button
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ display: 'block', mt: 2 }}
        onSubmit={handleSubmit(onsubmit)}
      >
        Save
      </Button>
    </Box>
  );
}
