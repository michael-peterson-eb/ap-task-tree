import {
  cleanLabel,
} from '../common/Utils';

export const fieldLabel = (text:string) => {
  return(
    <div dangerouslySetInnerHTML={{
      __html: cleanLabel(text)
    }} />
  )
}