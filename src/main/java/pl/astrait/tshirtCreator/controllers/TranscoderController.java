package pl.astrait.tshirtCreator.controllers;

import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.UUID;

import javax.imageio.ImageIO;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import pl.astrait.tshirtCreator.services.TranscodeService;

@Controller
public class TranscoderController {

	@Autowired
	ServletContext servletContext;

	@Autowired
	TranscodeService transcodeService;

	@RequestMapping(value = "/transcodeToJpeg", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)

	public @ResponseBody String transcodeToJpeg(@RequestParam("imageValue") String imageValue,
			HttpServletRequest request) {
		try {
			
			byte[] pngImageByte = transcodeService.base64toByte(imageValue);
			BufferedImage jpegBufferedImage = transcodeService.transcodePngToJpeg(pngImageByte);

			
			String uniqueName = getUniqueName();
			Path rootPath = Paths.get(servletContext.getRealPath("/"));
			String pngPathSuffix = "assets/images/" + uniqueName + ".png";
			String jpegPathSuffix = "assets/images/" + uniqueName + ".jpeg";
			Path pngPath = rootPath.resolve(pngPathSuffix);
			Path jpegPath = rootPath.resolve(jpegPathSuffix);
			
			// write png file
			Files.write(pngPath, pngImageByte);
			// write to jpeg file
			ImageIO.write(jpegBufferedImage, "jpg", jpegPath.toFile());
			return "{\"jpegPath\":\"" + jpegPathSuffix + "\"}";
		} catch (Exception e) {
			return "{\"error\":\""+ e + "\"}";
		}

	}
	
	private String getUniqueName(){
		return UUID.randomUUID().toString();
	}
}
