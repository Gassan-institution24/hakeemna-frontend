// import PropTypes from 'prop-types';

// import { Button } from '@mui/material';

// import { StyledEditorToolbar } from './styles';

// // ----------------------------------------------------------------------

// const HEADINGS = ['Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'Heading 5', 'Heading 6'];

// export const formats = [
//   'align',
//   'background',
//   'blockquote',
//   'bold',
//   'size',
//   'bullet',
//   'code',
//   'code-block',
//   'color',
//   'direction',
//   'font',
//   'formula',
//   'header',
//   'image',
//   'indent',
//   'italic',
//   'link',
//   'list',
//   'script',
//   'size',
//   'strike',
//   'table',
//   'underline',
//   'video',
// ];

// export default function Toolbar({ id, simple, ...other }) {
//   return (
//     <StyledEditorToolbar {...other}>
//       <div id={id}>
//         <div className="ql-formats">
//           <select className="ql-header" defaultValue="">
//             {HEADINGS.map((heading, index) => (
//               <option key={heading} value={index + 1}>
//                 {heading}
//               </option>
//             ))}
//             <option value="">Normal</option>
//           </select>
//         </div>

//         <div className="ql-formats">
//           <Button type="button" className="ql-bold" />
//           <Button type="button" className="ql-italic" />
//           <Button type="button" className="ql-underline" />
//           <Button type="button" className="ql-strike" />
//         </div>

//         {!simple && (
//           <div className="ql-formats">
//             <select className="ql-color" />
//             <select className="ql-background" />
//           </div>
//         )}

//         <div className="ql-formats">
//           <Button type="button" className="ql-list" value="ordered" />
//           <Button type="button" className="ql-list" value="bullet" />
//           {!simple && <Button type="button" className="ql-indent" value="-1" />}
//           {!simple && <Button type="button" className="ql-indent" value="+1" />}
//         </div>

//         {!simple && (
//           <div className="ql-formats">
//             <Button type="button" className="ql-script" value="super" />
//             <Button type="button" className="ql-script" value="sub" />
//           </div>
//         )}

//         {!simple && (
//           <div className="ql-formats">
//             <Button type="button" className="ql-code-block" />
//             <Button type="button" className="ql-blockquote" />
//           </div>
//         )}

//         <div className="ql-formats">
//           <Button type="button" className="ql-direction" value="rtl" />
//           <select className="ql-align" />
//         </div>

//         <div className="ql-formats">
//           <Button type="button" className="ql-link" />
//           <Button type="button" className="ql-image" />
//           <Button type="button" className="ql-video" />
//         </div>

//         <div className="ql-formats">
//           {!simple && <Button type="button" className="ql-formula" />}
//           <Button type="button" className="ql-clean" />
//         </div>
//       </div>
//     </StyledEditorToolbar>
//   );
// }

// Toolbar.propTypes = {
//   id: PropTypes.string,
//   simple: PropTypes.bool,
// };
