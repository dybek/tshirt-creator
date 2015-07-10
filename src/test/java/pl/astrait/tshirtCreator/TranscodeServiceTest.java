package pl.astrait.tshirtCreator;

import static org.junit.Assert.*;

import java.awt.image.BufferedImage;
import java.io.IOException;

import org.junit.Test;

import pl.astrait.tshirtCreator.services.TranscodeService;

public class TranscodeServiceTest {

	String base64image = "data:image/octet-stream;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAeCAIAAAApXzB9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAADbSURBVEhL7Y1BCgJBDAR9iEf//zPfsDZMLTg9ySQgyCIWdUon6dvxLS7Z9Lw/TIIedZN9X2Wvomiyp5lsb9k12bu93OSkTfaoI5cJcZO9GJKdWDoki+g2EczYjiSICJrsWBJE2KYkWKibmOY0973JziRBju1LgpmiiWlF5+rflNG5ukyTJMixfUkw402ic/ZOc79ukgQRtikJFlpNkmzGdoZkC0GTsOMh2YmlQ7KIuEnYi45cJqRNwh7t5SZn1yTsXSbbW4omYU9X2auomwb2fUjWo9v0Ob/XdBwvjngn+VJZcV0AAAAASUVORK5CYII=";
	
	@Test
	public void testBase64toByte() throws IOException {
		TranscodeService transcodeService = new TranscodeService();
		byte[] imageFile = transcodeService.base64toByte(base64image);
		BufferedImage image = transcodeService.transcodePngToJpeg(imageFile);
		assertEquals(image.getHeight(), 30);
		assertEquals(image.getWidth(), 35);
	}

}
