// const collapsible = useBoolean();

// return (
//   <>
//     <TableRow>
//       <TableCell>test</TableCell>
//       <TableCell>test</TableCell>
//       <TableCell>test</TableCell>
//     </TableRow>

//     <TableRow>
//       <TableCell sx={{ py: 2 }} colSpan={6}>
//         <IconButton
//           size="small"
//           color={collapsible.value ? 'inherit' : 'default'}
//           onClick={collapsible.onToggle}
//           sx={{borderRadius:0}}
//         >
//           Blogs{' '}
//           <Iconify
//             icon={collapsible.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
//           />
//         </IconButton>

//         <Collapse in={collapsible.value} unmountOnExit>
//           <Paper
//             variant="outlined"
//             sx={{
//               py: 2,
//               m: 2,
//               borderRadius: 1.5,
//               ...(collapsible.value && {
//                 boxShadow: (theme) => theme.customShadows.z20,
//               }),
//             }}
//           >
//             <Typography variant="h6" sx={{ m: 2, mt: 0 }}>
//               History
//             </Typography>

//             <Table size="small" aria-label="purchases">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>
//                     <Typography>
//                       Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illum
//                       consequuntur, unde nobis ea totam placeat ad maiores, quibusdam dolore,
//                       laborum dolores minus recusandae. Eius, voluptatibus ullam aut laudantium
//                       praesentium dolorum!
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//             </Table>
//           </Paper>
//         </Collapse>
//       </TableCell>
//     </TableRow>
