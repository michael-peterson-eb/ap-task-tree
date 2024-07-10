import { TextField, Typography } from "@mui/material";
import { Fragment } from "react";
import { fieldWithLabel, showLabel } from "../common/Utils";
import { fieldLabel } from "./Helpers";

export const FieldValue = (props: any) => {
  const { withLabel, fieldValue, data} = props;

  return (
    <Fragment>
      {!fieldWithLabel(withLabel) &&
        <Typography ml={2} mt={1} mb={1}>
          {fieldValue}
        </Typography>
      }

      {fieldWithLabel(withLabel) &&
        <TextField
          label={showLabel(withLabel, fieldLabel(data.EA_SA_txtaQuestion))}
          value={fieldValue}
          InputProps={{ readOnly: true }}
        />
      }
    </Fragment>
  )
}