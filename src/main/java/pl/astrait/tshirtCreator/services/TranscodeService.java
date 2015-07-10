package pl.astrait.tshirtCreator.services;

import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Base64;

import javax.imageio.ImageIO;

import org.springframework.stereotype.Component;

@Component
public class TranscodeService {
	
	public byte[] base64toByte(String base64Url) {
		return Base64.getDecoder().decode(base64Url.substring(31));
	}

	public BufferedImage transcodePngToJpeg(byte[] imageByte) throws IOException {
		BufferedImage pngImageBuffer = ImageIO.read(new ByteArrayInputStream(imageByte));
		BufferedImage jpegBufferedImage = new BufferedImage(
			pngImageBuffer.getWidth(),
			pngImageBuffer.getHeight(),
			BufferedImage.TYPE_INT_RGB
		);
		jpegBufferedImage.createGraphics().drawImage(pngImageBuffer, 0, 0, Color.WHITE, null);
		
		return jpegBufferedImage;
	}
}
