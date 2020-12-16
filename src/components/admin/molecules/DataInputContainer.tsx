import * as React from "react";
import { useState, useCallback, useRef } from "react";
import { makeStyles } from "@material-ui/styles";
import { Theme, createMuiTheme } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import {
  Paper,
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  TextField,
  CardMedia,
  Button
} from "@material-ui/core";
import { useDropzone } from "react-dropzone";

const theme = createMuiTheme();

const useStyles = makeStyles({
  dataInputContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row"
  },
  typeFiled: {
    width: "10%",
    minWidth: 100
  },
  typeContainer: {
    width: "10%",
    minWidth: 100,
    maxWidth: 150,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  typeLegend: {
    textAlign: "center"
  },
  descUrlContainer: {
    width: "50%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  descriptionFiels: {
    width: "100%"
  },
  descriptionContainer: {
    width: "100%",
    alignContent: "flex-start",
    margin: "8px 0px 8px 0px"
  },
  dropzone: {
    width: "100%",
    height: 200,
    boxSizing: "border-box",
    borderWidth: 2,
    borderColor: "#666666",
    borderStyle: "dashed",
    borderRadius: 5,
    verticalAlign: "middle",
    marginTop: "8px"
  },
  thumbContainer: {
    width: "50%",
    maxWidth: "400px"
  },
  submitButtonPos: {
    alignSelf: "flex-end"
  },
  thumbnailContainer: {
    marginTop: "16px",
    width: "100%",
    display: "flex",
    flexDirection: "column"
  },
  thumbnailTitle: {
    alignSelf: "flex-start"
  },
  buttonContainer: {
    marginTop: "16px",
    display: "flex",
    flexDirection: "row-reverse",
    width: "100%"
  },
  submitButton: {
    //color: theme.palette.getContrastText(green[500]),
    backgroundColor: green[400],
    "&:hover": {
      backgroundColor: green[700]
    }
  }
});

const types = ["text", "img", "link"];
const controlLabels = types.map((val) => {
  return <FormControlLabel value={val} control={<Radio />} label={val} />;
});

interface IFileAndUrl {
  file: File;
  url: string;
}

const DataInputContainer = () => {
  const classes = useStyles();
  const [files, setFiles] = useState<IFileAndUrl[] | null>(null);
  const [typeValue, setTypeValue] = useState("text");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [urlValue, setUrlValue] = useState("");
  const isReady = useRef(false);

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypeValue(event.target.value);
    if (files) {
      files.forEach((f) => {
        URL.revokeObjectURL(f.url);
      });
    }
    setFiles(null);
  };

  const handleDescriptionInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescriptionValue(event.target.value);
  };

  const handleUrlInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrlValue(event.target.value);
  };

  const acceptFileType = "image/*";
  const maxFileSize = 1048576;

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    console.log("onDrop");

    // previewの追加
    setFiles(
      acceptedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file)
      }))
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: acceptFileType,
    minSize: 0,
    maxSize: maxFileSize
  });

  isReady.current =
    typeValue === "text"
      ? descriptionValue !== ""
      : typeValue === "link"
      ? descriptionValue !== "" && urlValue !== ""
      : descriptionValue !== "" && urlValue !== "" && files !== null;

  const thumb =
    files !== null
      ? files.map((f) => {
          return (
            <img
              className={classes.thumbContainer}
              src={f.url}
              alt={f.file.name}
            />
          );
        })
      : undefined;

  return (
    <div className={classes.dataInputContainer}>
      {/*type select*/}
      <FormControl component="fieldset" className={classes.typeContainer}>
        <FormLabel component="legend" className={classes.typeLegend}>
          Type
        </FormLabel>
        <RadioGroup
          aria-label="type"
          name="type-select"
          value={typeValue}
          onChange={handleTypeChange}
        >
          {controlLabels && controlLabels}
        </RadioGroup>
      </FormControl>

      <div className={classes.descUrlContainer}>
        {/*description form*/}
        <form
          noValidate
          autoComplete="off"
          className={classes.descriptionFiels}
        >
          <TextField
            id="description-input"
            label="description"
            value={descriptionValue}
            onChange={handleDescriptionInputChange}
            className={classes.descriptionContainer}
          />
        </form>

        <form
          noValidate
          autoComplete="off"
          className={classes.descriptionFiels}
        >
          <TextField
            id="url-input"
            label="url"
            value={urlValue}
            onChange={handleUrlInputChange}
            disabled={typeValue === "text"}
            className={classes.descriptionContainer}
          />
        </form>

        {/*drop zone*/}
        {typeValue === "img" && (
          <>
            <Paper className={classes.dropzone} {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>ファイルをドラッグしてください</p>
              ) : (
                <p>
                  ファイルをドラッグ＆ドロップするか、クリックしてファイルを選択してください
                </p>
              )}
            </Paper>
            <div className={classes.thumbnailContainer}>
              <Typography variant="body1" className={classes.thumbnailTitle}>
                サムネイル
              </Typography>
              {thumb && thumb}
            </div>
          </>
        )}

        {/* submit */}
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            disabled={!isReady.current}
            classes={{ root: classes.submitButton }}
            className={classes.submitButtonPos}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataInputContainer;
